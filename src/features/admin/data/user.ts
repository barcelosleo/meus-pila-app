import type { PaginatedEntity } from "../../../data/paginated-entity";
import type { Role } from "../../authentication/data/role";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  createdBy: string | null;
  createdById: string | null;
  updatedAt: Date;
  updatedBy: string | null;
  updatedById: string | null;
}

export interface PaginatedUsers extends PaginatedEntity<User> {}
