import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../authentication";
import type {
  GridColDef,
  GridPaginationModel,
  GridSortModel,
} from "@mui/x-data-grid";
import {
  Alert,
  Avatar,
  Box,
  Chip,
  Snackbar,
  Typography,
  alpha,
} from "@mui/material";
import { DataTable, GroupIcon } from "../../../components/ui";
import { GroupDrawer } from "./GroupDrawer";
import type { Group, PaginatedGroups } from "../data/group";
import { formatDateTime } from "../../../utils/formatters";

const DEFAULT_PAGE_SIZE = 10;

const formatDate = formatDateTime;

export const GroupsTable = () => {
  const { api } = useAuth();
  const [groups, setGroups] = useState<PaginatedGroups | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

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
        setSnackbar({
          open: true,
          message: "Erro ao carregar a lista de grupos.",
          severity: "error",
        });
        setGroups(null);
      } finally {
        setLoading(false);
      }
    },
    [api, ordering],
  );

  const handleRefresh = useCallback(() => {
    fetchGroups(paginationModel.page, paginationModel.pageSize);
  }, [fetchGroups, paginationModel.page, paginationModel.pageSize]);

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
      try {
        if (payload.id) {
          await api.put(`/group/${payload.id}`, payload);
          setSnackbar({
            open: true,
            message: `Grupo "${payload.name}" atualizado com sucesso!`,
            severity: "success",
          });
        } else {
          await api.post("/group", payload);
          setSnackbar({
            open: true,
            message: `Grupo "${payload.name}" criado com sucesso!`,
            severity: "success",
          });
        }

        await fetchGroups(paginationModel.page, paginationModel.pageSize);
        handleCloseDrawer();
      } catch (error) {
        console.error("Error saving group:", error);
        throw error;
      }
    },
    [
      api,
      fetchGroups,
      handleCloseDrawer,
      paginationModel.page,
      paginationModel.pageSize,
    ],
  );

  const handleDeleteGroup = useCallback(
    async (group: Group) => {
      try {
        await api.delete(`/group/${group.id}`);
        setGroups((currentGroups) => {
          if (!currentGroups) return currentGroups;

          return {
            ...currentGroups,
            totalCount: Math.max(currentGroups.totalCount - 1, 0),
            items: currentGroups.items.filter((item) => item.id !== group.id),
          };
        });
        setSnackbar({
          open: true,
          message: `Grupo "${group.name}" removido com sucesso!`,
          severity: "success",
        });
      } catch (error) {
        console.error("Error deleting group:", error);
        setSnackbar({
          open: true,
          message: "Erro ao excluir o grupo. Tente novamente.",
          severity: "error",
        });
        throw error;
      }
    },
    [api],
  );

  useEffect(() => {
    fetchGroups(paginationModel.page, paginationModel.pageSize);
  }, [fetchGroups, paginationModel.page, paginationModel.pageSize]);

  // Client-side quick filter on current page items
  const filteredRows = useMemo(() => {
    if (!groups?.items) return [];
    if (!searchQuery.trim()) return groups.items;

    const query = searchQuery.toLowerCase().trim();
    return groups.items.filter(
      (group) =>
        group.name?.toLowerCase().includes(query) ||
        String(group.id).toLowerCase().includes(query) ||
        group.createdBy?.toLowerCase().includes(query) ||
        group.updatedBy?.toLowerCase().includes(query),
    );
  }, [groups?.items, searchQuery]);

  const columns = useMemo<GridColDef<Group>[]>(
    () => [
      // {
      //   field: "id",
      //   headerName: "#",
      //   width: 80,
      //   minWidth: 70,
      //   renderCell: (params) => (
      //     <Typography
      //       variant="caption"
      //       sx={{
      //         fontFamily: "monospace",
      //         color: "text.secondary",
      //         bgcolor: (theme) =>
      //           theme.palette.mode === "dark"
      //             ? "rgba(255, 255, 255, 0.06)"
      //             : "rgba(0, 0, 0, 0.04)",
      //         px: 0.9,
      //         py: 0.35,
      //         borderRadius: "6px",
      //         fontWeight: 600,
      //         fontSize: "0.75rem",
      //         letterSpacing: "0.02em",
      //       }}
      //     >
      //       #{params.value}
      //     </Typography>
      //   ),
      // },
      {
        field: "name",
        headerName: "Nome do Grupo",
        flex: 1.5,
        minWidth: 200,
        renderCell: (params) => {
          const name = String(params.value ?? "");
          const initial = name ? name.charAt(0).toUpperCase() : "G";
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                width: "100%",
                py: 0.5,
              }}
            >
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.primary.main, 0.25)
                      : alpha(theme.palette.primary.main, 0.12),
                  color: "primary.main",
                  border: "1px solid",
                  borderColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.25),
                }}
              >
                {initial}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                    fontSize: "0.875rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {name}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        field: "ownerName",
        headerName: "Proprietário",
        flex: 1,
        minWidth: 140,
        renderCell: (params) => {
          const val = params.value as string | null;
          if (!val) {
            return (
              <Typography variant="body2" color="text.disabled">
                —
              </Typography>
            );
          }
          return (
            <Chip
              size="small"
              variant="outlined"
              label={val}
              sx={{
                borderRadius: "6px",
                borderColor: "divider",
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.03)"
                    : "rgba(0, 0, 0, 0.02)",
                fontWeight: 500,
                fontSize: "0.75rem",
              }}
            />
          );
        },
      },
      {
        field: "createdAt",
        headerName: "Criado em",
        flex: 1,
        minWidth: 150,
        renderCell: (params) => {
          const formatted = formatDate(params.value);
          if (!formatted) {
            return (
              <Typography variant="body2" color="text.disabled">
                —
              </Typography>
            );
          }
          return (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, fontSize: "0.825rem", lineHeight: 1.2 }}
              >
                {formatted.date}
              </Typography>
              {formatted.time && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: "0.725rem" }}
                >
                  {formatted.time}
                </Typography>
              )}
            </Box>
          );
        },
      },
      {
        field: "createdByName",
        headerName: "Criado por",
        flex: 1,
        minWidth: 140,
        renderCell: (params) => {
          const val = params.value as string | null;
          if (!val) {
            return (
              <Typography variant="body2" color="text.disabled">
                —
              </Typography>
            );
          }
          return (
            <Chip
              size="small"
              variant="outlined"
              label={val}
              sx={{
                borderRadius: "6px",
                borderColor: "divider",
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.03)"
                    : "rgba(0, 0, 0, 0.02)",
                fontWeight: 500,
                fontSize: "0.75rem",
              }}
            />
          );
        },
      },
      {
        field: "updatedAt",
        headerName: "Atualizado em",
        flex: 1,
        minWidth: 150,
        renderCell: (params) => {
          const formatted = formatDate(params.value);
          if (!formatted) {
            return (
              <Typography variant="body2" color="text.disabled">
                —
              </Typography>
            );
          }
          return (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, fontSize: "0.825rem", lineHeight: 1.2 }}
              >
                {formatted.date}
              </Typography>
              {formatted.time && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: "0.725rem" }}
                >
                  {formatted.time}
                </Typography>
              )}
            </Box>
          );
        },
      },
      {
        field: "updatedByName",
        headerName: "Atualizado por",
        flex: 1,
        minWidth: 140,
        renderCell: (params) => {
          const val = params.value as string | null;
          if (!val) {
            return (
              <Typography variant="body2" color="text.disabled">
                —
              </Typography>
            );
          }
          return (
            <Chip
              size="small"
              variant="outlined"
              label={val}
              sx={{
                borderRadius: "6px",
                borderColor: "divider",
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.03)"
                    : "rgba(0, 0, 0, 0.02)",
                fontWeight: 500,
                fontSize: "0.75rem",
              }}
            />
          );
        },
      },
    ],
    [],
  );

  return (
    <>
      <DataTable<Group>
        title="Grupos"
        subtitle="Gerencie grupos, permissões e acessos dos usuários no sistema."
        icon={<GroupIcon sx={{ fontSize: 24 }} />}
        totalCount={groups?.totalCount}
        totalCountLabel="grupo"
        totalCountLabelPlural="grupos"
        rows={filteredRows}
        columns={columns}
        loading={loading}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        onRefresh={handleRefresh}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Buscar por nome, criador..."
        onAdd={handleAddGroup}
        addButtonLabel="Adicionar grupo"
        onEdit={handleEditGroup}
        onDelete={handleDeleteGroup}
        deleteConfirmation={{
          title: "Excluir grupo",
          getMessage: (group) => (
            <>
              Tem certeza de que deseja remover o grupo{" "}
              <strong>"{group.name}"</strong>? Todos os acessos e permissões
              vinculados a este grupo serão impactados.
            </>
          ),
          confirmLabel: "Excluir Grupo",
        }}
      />

      <GroupDrawer
        open={drawerOpen}
        group={selectedGroup}
        onClose={handleCloseDrawer}
        onSave={handleSaveGroup}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            fontWeight: 500,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};
