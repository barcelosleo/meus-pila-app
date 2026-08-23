import type { PaginatedEntity } from "../../../data/paginated-entity";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "User" | "GroupManager";
  isActive: boolean;
  createdAt: Date;
  createdBy: string | null;
  createdById: string | null;
  updatedAt: Date;
  updatedBy: string | null;
  updatedById: string | null;
}

export interface PaginatedUsers extends PaginatedEntity<User> {}
