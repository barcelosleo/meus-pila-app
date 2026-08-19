import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../authentication";
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridSortModel,
} from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { GroupDrawer } from "./GroupDrawer";
import type { Group, PaginatedGroups } from "../data/group";

const DEFAULT_PAGE_SIZE = 10;

const formatDate = (value: string | Date | null | undefined) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.toString();

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const GroupsTable = () => {
  const { api } = useAuth();
  const [groups, setGroups] = useState<PaginatedGroups | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  const ordering = sortModel[0]
    ? `${sortModel[0].field.charAt(0).toUpperCase()}${sortModel[0].field.slice(1)}${sortModel[0].sort === "asc" ? "Asc" : "Desc"}`
    : undefined;

  const fetchGroups = useCallback(
    async (page: number, pageSize: number) => {
      setLoading(true);

      try {
        const params = new URLSearchParams({
          pageNumber: String(page + 1),
          pageSize: String(pageSize),
        });

        if (ordering) {
          params.set("ordering", ordering);
        }
        const response = await api.get<PaginatedGroups>(
          `/group?${params.toString()}`,
        );
        setGroups(response);
      } catch (error) {
        console.error("Error fetching groups:", error);
        setGroups(null);
      } finally {
        setLoading(false);
      }
    },
    [api, ordering],
  );

  const handleCloseDrawer = useCallback(() => {
    setSelectedGroup(null);
    setDrawerOpen(false);
  }, []);

  const handleAddGroup = useCallback(() => {
    setSelectedGroup(null);
    setDrawerOpen(true);
  }, []);

  const handleEditGroup = useCallback((group: Group) => {
    setSelectedGroup(group);
    setDrawerOpen(true);
  }, []);

  const handleSaveGroup = useCallback(
    async (payload: { id?: string; name: string }) => {
      if (payload.id) {
        await api.put(`/group/${payload.id}`, payload);
      } else {
        await api.post("/group", payload);
      }

      await fetchGroups(paginationModel.page, paginationModel.pageSize);
      handleCloseDrawer();
    },
    [
      api,
      fetchGroups,
      handleCloseDrawer,
      paginationModel.page,
      paginationModel.pageSize,
    ],
  );

  const handleRemoveGroup = useCallback(
    async (groupId: string) => {
      const groupToDelete = groups?.items.find((group) => group.id === groupId);
      const confirmed = window.confirm(
        `Tem certeza que deseja remover o grupo "${groupToDelete?.name ?? "selecionado"}"?`,
      );

      if (!confirmed) return;

      try {
        await api.delete(`/group/${groupId}`);
        setGroups((currentGroups) => {
          if (!currentGroups) return currentGroups;

          return {
            ...currentGroups,
            totalCount: Math.max(currentGroups.totalCount - 1, 0),
            items: currentGroups.items.filter((group) => group.id !== groupId),
          };
        });
      } catch (error) {
        console.error("Error deleting group:", error);
      }
    },
    [api, groups?.items],
  );

  useEffect(() => {
    fetchGroups(paginationModel.page, paginationModel.pageSize);
  }, [fetchGroups, paginationModel.page, paginationModel.pageSize]);

  const columns = useMemo<GridColDef[]>(
    () => [
      { field: "id", headerName: "#", width: 90 },
      { field: "name", headerName: "Nome", width: 180 },
      {
        field: "createdAt",
        headerName: "Criado em",
        width: 150,
        valueFormatter: (value) => formatDate(value),
      },
      {
        field: "createdBy",
        headerName: "Criado por",
        width: 150,
        valueFormatter: (value) => value || "-",
      },
      {
        field: "updatedAt",
        headerName: "Atualizado em",
        width: 150,
        valueFormatter: (value) => formatDate(value),
      },
      {
        field: "updatedBy",
        headerName: "Atualizado por",
        width: 150,
        valueFormatter: (value) => value || "-",
      },
      {
        field: "actions",
        headerName: "Ações",
        width: 200,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleEditGroup(params.row as Group)}
            >
              Editar
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleRemoveGroup(String(params.id))}
            >
              Remover
            </Button>
          </Box>
        ),
      },
    ],
    [handleEditGroup, handleRemoveGroup],
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={handleAddGroup}>
          Adicionar grupo
        </Button>
      </Box>

      <DataGrid
        rows={groups?.items ?? []}
        columns={columns}
        rowCount={groups?.totalCount ?? 0}
        loading={loading}
        pagination
        paginationMode="server"
        paginationModel={paginationModel}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
        autoHeight
      />

      <GroupDrawer
        open={drawerOpen}
        group={selectedGroup}
        onClose={handleCloseDrawer}
        onSave={handleSaveGroup}
      />
    </Box>
  );
};
