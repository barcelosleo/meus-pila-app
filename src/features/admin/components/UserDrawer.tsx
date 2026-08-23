import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  FormControlLabel,
  FormHelperText,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import { useAuth } from "../../authentication";
import { CloseIcon, GroupIcon } from "../../../components/ui";
import type { User } from "../data/user";

export interface UserDrawerProps {
  open: boolean;
  user?: User | null;
  onClose: () => void;
  onSave?: (payload: {
    id?: string;
    name: string;
    email: string;
    isActive: boolean;
  }) => Promise<void> | void;
}

export const UserDrawer = ({
  open,
  user,
  onClose,
  onSave,
}: UserDrawerProps) => {
  const { api } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [role, setRole] = useState<"Admin" | "User" | "GroupManager">("User");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(user?.id);

  useEffect(() => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setRole(user?.role ?? "User");
    setIsActive(user?.isActive ?? true);
    setError("");
  }, [user, open]);

  const validateName = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) return "O nome do usuário é obrigatório.";
    if (trimmed.length < 2)
      return "O nome do usuário deve ter pelo menos 2 caracteres.";

    if (trimmed.length > 100)
      return "O nome do usuário não pode ter mais de 100 caracteres.";

    return "";
  };

  const validateEmail = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) return "O e-mail do usuário é obrigatório.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) return "O e-mail do usuário é inválido.";

    return "";
  };

  const handleIsActiveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsActive(event.target.checked);
    console.log("Switch change event:", event.target.checked);
    console.log(isActive);
  };

  const validatePassword = (value: string) => {
    const trimmed = value.trim();

    if (!isEditing && !trimmed) return "A senha do usuário é obrigatória.";
    if (trimmed && trimmed.length < 8)
      return "A senha do usuário deve ter pelo menos 8 caracteres.";

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/;
    if (trimmed && !passwordRegex.test(trimmed))
      return "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.";

    return "";
  };

  const validateRole = (value: string) => {
    if (!["Admin", "User", "GroupManager"].includes(value)) {
      return "O papel do usuário é inválido.";
    }
    return "";
  };

  const handleSubmit = async (event?: React.SubmitEvent) => {
    if (event) {
      event.preventDefault();
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedRole: "Admin" | "User" | "GroupManager" = role.trim() as
      | "Admin"
      | "User"
      | "GroupManager";
    const nextNameError = validateName(trimmedName);
    const nextEmailError = validateEmail(trimmedEmail);
    const nextPasswordError = validatePassword(trimmedPassword);
    const nextRoleError = validateRole(trimmedRole);

    if (nextNameError) {
      setError(nextNameError);
      return;
    }

    if (nextEmailError) {
      setError(nextEmailError);
      return;
    }

    if (nextPasswordError) {
      setError(nextPasswordError);
      return;
    }

    if (nextRoleError) {
      setError(nextRoleError);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload: {
        id?: string;
        name: string;
        email: string;
        password?: string;
        isActive: boolean;
        role: "Admin" | "User" | "GroupManager";
      } = {
        id: user?.id,
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword || undefined,
        isActive: isActive,
        role: trimmedRole,
      };

      if (onSave) {
        await onSave(payload);
      } else if (isEditing && user?.id) {
        await api.put(`/user/${user.id}`, payload);
      } else {
        await api.post("/user", payload);
      }
      onClose();
    } catch (err) {
      console.error("Error saving group:", err);
      setError("Ocorreu um erro ao salvar o usuário.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setName("");
      setEmail("");
      setPassword("");
      setIsActive(true);
      setRole("User");
      setError("");
    }
  }, [open]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 460 },
            borderTopLeftRadius: { xs: 0, sm: 16 },
            borderBottomLeftRadius: { xs: 0, sm: 16 },
            boxShadow: "-8px 0 32px rgba(0, 0, 0, 0.15)",
          },
        },
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Drawer Header */}
        <Box
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.primary.main, 0.2)
                    : alpha(theme.palette.primary.main, 0.1),
                color: "primary.main",
                width: 42,
                height: 42,
                borderRadius: 2,
              }}
            >
              <GroupIcon sx={{ fontSize: 22 }} />
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, lineHeight: 1.2 }}
              >
                {isEditing ? "Editar usuário" : "Novo usuário"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {isEditing
                  ? `Atualize os dados de "${user?.name}"`
                  : "Cadastre um novo usuário"}
              </Typography>
            </Box>
          </Box>

          <IconButton
            onClick={onClose}
            size="small"
            aria-label="Fechar"
            sx={{
              color: "text.secondary",
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.04)",
              borderRadius: "8px",
              "&:hover": {
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.08)",
              },
            }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        <Divider />

        {/* Drawer Body */}
        <Box sx={{ p: 3, flexGrow: 1, overflowY: "auto" }}>
          <Stack spacing={3}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Nome do usuário"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (error) setError(validateName(event.target.value));
              }}
              fullWidth
              autoFocus
              required
              placeholder="Ex: João da Silva, Maria Oliveira"
              error={Boolean(error)}
              helperText={
                error || "Insira um nome claro e identificável para o usuário"
              }
              slotProps={{
                input: {
                  sx: { borderRadius: 2 },
                },
              }}
            />

            <TextField
              label="Email do usuário"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (error) setError(validateEmail(event.target.value));
              }}
              fullWidth
              required
              placeholder="Ex: joao.silva@email.com, maria.oliveira@email.com"
              error={Boolean(error)}
              helperText={error || "Insira um email válido para o usuário"}
              slotProps={{
                input: {
                  sx: { borderRadius: 2 },
                },
              }}
            />

            <Select
              label="Papel do usuário"
              value={role}
              onChange={(event) => {
                setRole(
                  event.target.value as "Admin" | "User" | "GroupManager",
                );
                if (error) setError(validateRole(event.target.value));
              }}
              fullWidth
              required
              error={Boolean(error)}
              slotProps={{
                input: {
                  sx: { borderRadius: 2 },
                },
              }}
            >
              <MenuItem value="User">Usuário</MenuItem>
              <MenuItem value="Admin">Administrador</MenuItem>
              <MenuItem value="GroupManager">Gerente de Grupo</MenuItem>
            </Select>
            <FormHelperText error={Boolean(error)}>
              {error || "Selecione o papel do usuário"}
            </FormHelperText>

            <TextField
              label="Senha do usuário"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (error) setError(validatePassword(event.target.value));
              }}
              fullWidth
              type="password"
              placeholder={
                isEditing
                  ? "Deixe em branco para manter a senha atual"
                  : "Ex: Senha@123"
              }
              error={Boolean(error)}
              helperText={
                error ||
                (isEditing
                  ? "Deixe em branco para manter a senha atual"
                  : "Insira uma senha segura para o usuário")
              }
              slotProps={{
                input: {
                  sx: { borderRadius: 2 },
                },
              }}
            />

            <FormControlLabel
              control={
                <Switch
                  slotProps={{ input: { "aria-label": "Ativo" } }}
                  checked={isActive}
                  onChange={handleIsActiveChange}
                />
              }
              label="Ativo"
            />
          </Stack>
        </Box>
        <Divider />

        {/* Drawer Footer */}
        <Box
          sx={{
            p: 2.5,
            px: 3,
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.5,
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.02)"
                : "#fafbfc",
          }}
        >
          <Button
            variant="outlined"
            color="inherit"
            onClick={onClose}
            disabled={submitting}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 2.5,
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting || !name.trim()}
            startIcon={
              submitting ? <CircularProgress size={16} color="inherit" /> : null
            }
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              boxShadow: (theme) =>
                `0 4px 12px ${alpha(theme.palette.primary.main, 0.35)}`,
            }}
          >
            {submitting
              ? "Salvando..."
              : isEditing
                ? "Salvar alterações"
                : "Criar usuário"}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};
