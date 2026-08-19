export interface Group {
  id: string;
  name: string;
  createdAt: Date;
  createdBy: string | null;
  updatedAt: Date;
  updatedBy: string | null;
}

export interface PaginatedGroups {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  items: Group[];
}
