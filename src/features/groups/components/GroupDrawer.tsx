import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Drawer,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "../../authentication";
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

    return "";
  };

  const handleSubmit = async () => {
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
    } catch (error) {
      console.error("Error saving group:", error);
      setError("Não foi possível salvar o grupo. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 420, p: 3 }} role="presentation">
        <Typography variant="h5" sx={{ mb: 3 }}>
          {isEditing ? "Editar grupo" : "Adicionar grupo"}
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="Nome do grupo"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (error) setError(validateName(event.target.value));
            }}
            fullWidth
            autoFocus
            placeholder="Ex: Equipe Financeira"
            error={Boolean(error)}
            helperText={error}
          />

          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: "flex-end" }}
          >
            <Button variant="outlined" onClick={onClose} disabled={submitting}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting || !name.trim()}
            >
              {submitting ? "Salvando..." : isEditing ? "Salvar" : "Criar"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Drawer>
  );
};
