import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import {
  ApiClient,
  LocalStorageTokenStore,
  type TokenPair,
} from "../../../services/api-client";
import { hasRole as checkRole, type Role } from "../data/role";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (allowed: Role[]) => boolean;
  api: ApiClient;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({
  baseUrl,
  children,
}: {
  baseUrl: string;
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const api = useMemo(
    () => new ApiClient(baseUrl, new LocalStorageTokenStore()),
    [baseUrl],
  );

  const logout = useCallback(() => {
    api.logout();
    setUser(null);
  }, [api]);

  useEffect(() => {
    api.setSessionExpiredHandler(() => {
      setUser(null);
    });
  }, [api]);

  useEffect(() => {
    async function bootstrap() {
      const tokens = api.getTokens();
      if (!tokens) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await api.request<User>("/user/me");
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    bootstrap();
  }, [api]);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await api.request<TokenPair & User>("/user/authenticate", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        skipAuth: true,
      });

      api.setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        userId: data.id,
      });
      setUser({
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
      });
    },
    [api],
  );

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasRole: (allowed) => checkRole(user, allowed),
    api,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
