import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import { useAuth } from "../../authentication";
import { CloseIcon, GroupIcon } from "../../../components/ui";
import type { Group } from "../data/group";

export interface GroupDrawerProps {
  open: boolean;
  group?: Group | null;
  onClose: () => void;
  onSave?: (payload: { id?: string; name: string }) => Promise<void> | void;
}

export const GroupDrawer = ({
  open,
  group,
  onClose,
  onSave,
}: GroupDrawerProps) => {
  const { api } = useAuth();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(group?.id);

  useEffect(() => {
    setName(group?.name ?? "");
    setError("");
  }, [group, open]);

  const validateName = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) return "O nome do grupo é obrigatório.";
    if (trimmed.length < 2)
      return "O nome do grupo deve ter pelo menos 2 caracteres.";

    if (trimmed.length > 100)
      return "O nome do grupo não pode ter mais de 100 caracteres.";

    return "";
  };

  const handleSubmit = async (event?: React.SubmitEvent) => {
    if (event) {
      event.preventDefault();
    }

    const trimmedName = name.trim();
    const nextError = validateName(trimmedName);

    if (nextError) {
      setError(nextError);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload: { id?: string; name: string } = {
        id: group?.id,
        name: trimmedName,
      };

      if (onSave) {
        await onSave(payload);
      } else if (isEditing && group?.id) {
        await api.put(`/group/${group.id}`, payload);
      } else {
        await api.post("/group", payload);
      }

      onClose();
    } catch (err) {
      console.error("Error saving group:", err);
      setError("Não foi possível salvar o grupo. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

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
                {isEditing ? "Editar grupo" : "Novo grupo"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {isEditing
                  ? `Atualize os dados de "${group?.name}"`
                  : "Cadastre um novo grupo para gerenciar acessos"}
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
              label="Nome do grupo"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (error) setError(validateName(event.target.value));
              }}
              fullWidth
              autoFocus
              required
              placeholder="Ex: Equipe Financeira, Administradores"
              error={Boolean(error)}
              helperText={
                error || "Insira um nome claro e identificável para o grupo"
              }
              slotProps={{
                input: {
                  sx: { borderRadius: 2 },
                },
              }}
            />

            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.03)"
                    : "#f8fafc",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 0.5, color: "text.primary" }}
              >
                💡 Informação
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.825rem" }}
              >
                Os grupos são utilizados para agrupar usuários e gerenciar
                permissões de forma rápida e segura.
              </Typography>
            </Box>
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
                : "Criar grupo"}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};
