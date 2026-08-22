import { useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Chip,
  Snackbar,
  Typography,
  alpha,
} from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { DataTable, PeopleIcon } from "../components/ui";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  createdAt: string;
}

const initialUsers: UserItem[] = [
  {
    id: "1",
    name: "Leonardo Barcelos",
    email: "leobarcelos12@gmail.com",
    role: "Administrador",
    status: "active",
    createdAt: "2026-08-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Ana Carolina Santos",
    email: "ana.santos@empresa.com",
    role: "Gerente",
    status: "active",
    createdAt: "2026-08-18T14:30:00Z",
  },
  {
    id: "3",
    name: "Carlos Eduardo Silva",
    email: "carlos.silva@empresa.com",
    role: "Analista",
    status: "active",
    createdAt: "2026-08-20T09:15:00Z",
  },
];

export const UsersPage = () => {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase().trim();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q),
    );
  }, [users, searchQuery]);

  const handleAddUser = () => {
    const nextId = String(users.length + 1);
    const newUser: UserItem = {
      id: nextId,
      name: `Novo Usuário #${nextId}`,
      email: `usuario${nextId}@empresa.com`,
      role: "Analista",
      status: "active",
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [newUser, ...prev]);
    setSnackbar({
      open: true,
      message: `Usuário "${newUser.name}" adicionado com sucesso!`,
      severity: "success",
    });
  };

  const handleEditUser = (user: UserItem) => {
    setSnackbar({
      open: true,
      message: `Editar usuário: ${user.name}`,
      severity: "success",
    });
  };

  const handleDeleteUser = (user: UserItem) => {
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    setSnackbar({
      open: true,
      message: `Usuário "${user.name}" removido com sucesso!`,
      severity: "success",
    });
  };

  const columns = useMemo<GridColDef<UserItem>[]>(
    () => [
      {
        field: "id",
        headerName: "#",
        width: 80,
        renderCell: (params) => (
          <Typography
            variant="caption"
            sx={{
              fontFamily: "monospace",
              color: "text.secondary",
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.06)"
                  : "rgba(0, 0, 0, 0.04)",
              px: 0.9,
              py: 0.35,
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          >
            #{params.value}
          </Typography>
        ),
      },
      {
        field: "name",
        headerName: "Nome do Usuário",
        flex: 1.5,
        minWidth: 200,
        renderCell: (params) => {
          const name = String(params.value ?? "");
          const initial = name ? name.charAt(0).toUpperCase() : "U";
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
                  bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.15),
                  color: "secondary.main",
                  border: "1px solid",
                  borderColor: (theme) =>
                    alpha(theme.palette.secondary.main, 0.25),
                }}
              >
                {initial}
              </Avatar>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "text.primary" }}
              >
                {name}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: "email",
        headerName: "E-mail",
        flex: 1.5,
        minWidth: 220,
        renderCell: (params) => (
          <Typography variant="body2" color="text.secondary">
            {params.value}
          </Typography>
        ),
      },
      {
        field: "role",
        headerName: "Função / Papel",
        flex: 1,
        minWidth: 140,
        renderCell: (params) => (
          <Chip
            size="small"
            label={params.value}
            variant="outlined"
            color={params.value === "Administrador" ? "primary" : "default"}
            sx={{
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />
        ),
      },
      {
        field: "status",
        headerName: "Status",
        width: 120,
        renderCell: (params) => (
          <Chip
            size="small"
            label={params.value === "active" ? "Ativo" : "Inativo"}
            color={params.value === "active" ? "success" : "default"}
            sx={{
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />
        ),
      },
    ],
    [],
  );

  return (
    <>
      <title>Meus Pila - Usuários</title>
      <DataTable<UserItem>
        title="Usuários"
        subtitle="Gerencie as contas de usuários e permissões de acesso do sistema."
        icon={<PeopleIcon sx={{ fontSize: 24 }} />}
        totalCount={users.length}
        totalCountLabel="usuário"
        totalCountLabelPlural="usuários"
        rows={filteredUsers}
        columns={columns}
        loading={loading}
        paginationMode="client"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Buscar por nome, email ou função..."
        onAdd={handleAddUser}
        addButtonLabel="Novo Usuário"
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        deleteConfirmation={{
          title: "Excluir usuário",
          getMessage: (user) => (
            <>
              Tem certeza de que deseja remover o usuário{" "}
              <strong>"{user.name}"</strong>? O acesso dele ao sistema será
              revogado imediatamente.
            </>
          ),
          confirmLabel: "Excluir Usuário",
        }}
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

export default UsersPage;
