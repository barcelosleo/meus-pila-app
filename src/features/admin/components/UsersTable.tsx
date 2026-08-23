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
import { DataTable, PeopleIcon } from "../../../components/ui";
import { UserDrawer } from "./UserDrawer";
import type { User, PaginatedUsers } from "../data/user";
import { formatDateTime } from "../../../utils/formatters";

const DEFAULT_PAGE_SIZE = 10;

export const UsersTable = () => {
  const { api } = useAuth();
  const [users, setUsers] = useState<PaginatedUsers | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
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

  const fetchUsers = useCallback(
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
        const response = await api.get<PaginatedUsers>(
          `/user?${params.toString()}`,
        );
        setUsers(response);
      } catch (error) {
        console.error("Error fetching users:", error);
        setSnackbar({
          open: true,
          message: "Erro ao carregar a lista de usuários.",
          severity: "error",
        });
        setUsers(null);
      } finally {
        setLoading(false);
      }
    },
    [api, ordering, searchQuery],
  );

  const handleRefresh = useCallback(() => {
    fetchUsers(paginationModel.page, paginationModel.pageSize);
  }, [fetchUsers, paginationModel]);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    setSelectedUser(null);
  }, []);

  const handleAddUser = useCallback(() => {
    setSelectedUser(null);
    setDrawerOpen(true);
  }, []);

  const handleEditUser = useCallback((user: User) => {
    setSelectedUser(user);
    setDrawerOpen(true);
  }, []);

  const handleSaveUser = useCallback(
    async (user: Partial<User>) => {
      try {
        if (user.id) {
          // Update existing user
          await api.put(`/user/${user.id}`, user);
          setSnackbar({
            open: true,
            message: "Usuário atualizado com sucesso.",
            severity: "success",
          });
        } else {
          // Create new user
          await api.post("/user", user);
          setSnackbar({
            open: true,
            message: "Usuário criado com sucesso.",
            severity: "success",
          });
        }

        await fetchUsers(paginationModel.page, paginationModel.pageSize);
        handleCloseDrawer();
      } catch (error) {
        console.error("Error saving user:", error);
        setSnackbar({
          open: true,
          message: "Erro ao salvar o usuário.",
          severity: "error",
        });
      }
    },
    [
      api,
      fetchUsers,
      handleCloseDrawer,
      paginationModel.page,
      paginationModel.pageSize,
    ],
  );

  const handleDeleteUser = useCallback(
    async (user: User) => {
      try {
        await api.delete(`/user/${user.id}`);
        setSnackbar({
          open: true,
          message: "Usuário deletado com sucesso.",
          severity: "success",
        });
        await fetchUsers(paginationModel.page, paginationModel.pageSize);
      } catch (error) {
        console.error("Error deleting user:", error);
        setSnackbar({
          open: true,
          message: "Erro ao deletar o usuário.",
          severity: "error",
        });
      }
    },
    [api, fetchUsers, paginationModel.page, paginationModel.pageSize],
  );

  useEffect(() => {
    fetchUsers(paginationModel.page, paginationModel.pageSize);
  }, [fetchUsers, paginationModel.page, paginationModel.pageSize]);

  // Client-side quick filter on current page items
  const filteredRows = useMemo(() => {
    if (!users?.items) return [];
    if (!searchQuery.trim()) return users.items;

    const query = searchQuery.toLowerCase().trim();
    return users.items.filter(
      (user) =>
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.role?.toLowerCase().includes(query) ||
        String(user.isActive).toLowerCase().includes(query) ||
        String(user.id).toLowerCase().includes(query) ||
        user.createdBy?.toLowerCase().includes(query) ||
        user.updatedBy?.toLowerCase().includes(query),
    );
  }, [users?.items, searchQuery]);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "name",
        headerName: "Nome do Usuário",
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
        field: "email",
        headerName: "Email do Usuário",
        flex: 1.5,
        minWidth: 200,
        renderCell: (params) => {
          const email = String(params.value ?? "");
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
                  {email}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        field: "role",
        headerName: "Função do Usuário",
        flex: 1.5,
        minWidth: 200,
        renderCell: (params) => {
          const role = String(params.value ?? "User");
          let roleLabel;
          if (role === "Admin") {
            roleLabel = (
              <Chip label="Administrador" color="primary" size="small" />
            );
          } else if (role === "GroupManager") {
            roleLabel = (
              <Chip label="Gerente de Grupo" color="info" size="small" />
            );
          } else {
            roleLabel = <Chip label="Usuário" color="default" size="small" />;
          }
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
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  component="div"
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
                  {roleLabel}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        field: "isActive",
        headerName: "Status",
        flex: 1,
        minWidth: 100,
        renderCell: (params) => {
          const isActive = Boolean(params.value);
          return (
            <Chip
              label={isActive ? "Ativo" : "Inativo"}
              color={isActive ? "success" : "default"}
              size="small"
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
          const formatted = formatDateTime(params.value);
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
          const formatted = formatDateTime(params.value);
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
      <DataTable<User>
        title="Usuários"
        subtitle="Gerencie os usuários do sistema, suas funções e permissões."
        icon={<PeopleIcon sx={{ fontSize: 24 }} />}
        totalCount={users?.totalCount}
        totalCountLabel="usuário"
        totalCountLabelPlural="usuários"
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
        searchPlaceholder="Pesquisar por nome, email ou função..."
        onAdd={handleAddUser}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        deleteConfirmation={{
          title: "Excluir usuário",
          getMessage: (group) => (
            <>
              Tem certeza de que deseja remover o usuário{" "}
              <strong>"{group.name}"</strong>? Todos os acessos e permissões
              vinculados a este usuário serão impactados.
            </>
          ),
          confirmLabel: "Excluir Usuário",
        }}
      />

      <UserDrawer
        open={drawerOpen}
        user={selectedUser}
        onClose={handleCloseDrawer}
        onSave={handleSaveUser}
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
