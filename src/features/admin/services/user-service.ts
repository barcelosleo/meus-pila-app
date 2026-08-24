import type { ApiClient } from "../../../services/api-client";
import type { PaginatedUsers, User } from "../data/user";

interface FetchUsersOptions {
  page: number;
  pageSize: number;
  ordering?: string;
  searchQuery?: string;
}

export const fetchUsers = (
  api: ApiClient,
  { page, pageSize, ordering, searchQuery }: FetchUsersOptions,
) => {
  const params = new URLSearchParams({
    pageNumber: String(page + 1),
    pageSize: String(pageSize),
  });

  if (ordering) {
    params.set("ordering", ordering);
  }

  if (searchQuery) {
    params.set("searchTerm", searchQuery);
  }

  return api.get<PaginatedUsers>(`/users?${params.toString()}`);
};

export const fetchUserById = (api: ApiClient, id: string) => {
  return api.get<User>(`/users/${id}`);
};
