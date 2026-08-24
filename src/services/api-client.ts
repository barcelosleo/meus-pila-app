interface TokenPair {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

interface TokenStore {
  get(): TokenPair | null;
  set(tokens: TokenPair): void;
  clear(): void;
}

class LocalStorageTokenStore implements TokenStore {
  private storageKey: string;
  constructor(storageKey: string = "auth_tokens") {
    this.storageKey = storageKey;
  }

  get(): TokenPair | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as TokenPair;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }

  set(tokens: TokenPair): void {
    localStorage.setItem(this.storageKey, JSON.stringify(tokens));
  }

  clear(): void {
    localStorage.removeItem(this.storageKey);
  }
}

class ApiError extends Error {
  public status: number;
  public body: unknown;
  constructor(status: number, body: unknown) {
    super(`API error ${status}`);
    this.status = status;
    this.body = body;
  }
}

class SessionExpiredError extends Error {
  constructor() {
    super("Session expired, please login again");
  }
}

type RequestOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
  skipAuth?: boolean;
};

class ApiClient {
  private refreshPromise: Promise<TokenPair> | null = null;
  private onSessionExpired?: () => void;
  private baseUrl: string;
  private tokenStore: TokenStore;

  constructor(baseUrl: string, tokenStore: TokenStore) {
    this.baseUrl = baseUrl;
    this.tokenStore = tokenStore;
  }

  setSessionExpiredHandler(handler: () => void) {
    this.onSessionExpired = handler;
  }

  setTokens(tokens: TokenPair) {
    this.tokenStore.set(tokens);
  }

  getTokens() {
    return this.tokenStore.get();
  }

  logout() {
    this.tokenStore.clear();
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    return this.executeWithRetry<T>(path, options, false);
  }

  private async executeWithRetry<T>(
    path: string,
    options: RequestOptions,
    isRetry: boolean,
  ): Promise<T> {
    const res = await this.rawFetch(path, options);

    if (res.status !== 401 || options.skipAuth) {
      return this.parseResponse<T>(res);
    }

    if (isRetry) {
      this.handleSessionExpired();
      throw new SessionExpiredError();
    }

    try {
      await this.getOrCreateRefresh();
    } catch {
      this.handleSessionExpired();
      throw new SessionExpiredError();
    }

    return this.executeWithRetry<T>(path, options, true);
  }

  private async rawFetch(path: string, options: RequestOptions) {
    const tokens = this.tokenStore.get();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options.headers,
    };
    if (!options.skipAuth && tokens?.accessToken) {
      headers["Authorization"] = `Bearer ${tokens.accessToken}`;
    }
    return fetch(`${this.baseUrl}${path}`, { ...options, headers });
  }

  private async parseResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new ApiError(res.status, body);
    }
    if (res.status === 204) return undefined as T;
    return res.json();
  }

  private getOrCreateRefresh(): Promise<TokenPair> {
    if (this.refreshPromise) return this.refreshPromise;
    this.refreshPromise = this.doRefresh().finally(() => {
      this.refreshPromise = null;
    });
    return this.refreshPromise;
  }

  private async doRefresh(): Promise<TokenPair> {
    const current = this.tokenStore.get();
    if (!current?.refreshToken) throw new SessionExpiredError();

    const res = await fetch(`${this.baseUrl}/users/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refreshToken: current.refreshToken,
        userId: current.userId,
      }),
    });

    if (!res.ok) throw new SessionExpiredError();

    const data = await res.json();
    const newTokens: TokenPair = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      userId: current.userId,
    };
    this.tokenStore.set(newTokens);
    return newTokens;
  }

  private handleSessionExpired() {
    this.tokenStore.clear();
    this.onSessionExpired?.();
  }

  async get<T>(
    path: string,
    options: Omit<RequestOptions, "method"> = {},
  ): Promise<T> {
    return this.request<T>(path, { ...options, method: "GET" });
  }

  async post<T>(
    path: string,
    body: unknown,
    options: Omit<RequestOptions, "method"> = {},
  ): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async put<T>(
    path: string,
    body: unknown,
    options: Omit<RequestOptions, "method"> = {},
  ): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async delete<T>(
    path: string,
    options: Omit<RequestOptions, "method"> = {},
  ): Promise<T> {
    return this.request<T>(path, { ...options, method: "DELETE" });
  }
}

export { ApiClient, LocalStorageTokenStore, ApiError, SessionExpiredError };
export type { TokenPair };
