import type { PaginatedEntity } from "../../../data/paginated-entity";

export interface Group {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  createdBy: string | null;
  createdId: string | null;
  updatedAt: Date;
  updatedBy: string | null;
  updatedById: string | null;
}

export interface PaginatedGroups extends PaginatedEntity<Group> {}
