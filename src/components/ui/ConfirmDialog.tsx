import { type ReactNode } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  alpha,
} from "@mui/material";
import { DeleteIcon, WarningIcon } from "./icons";

export interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  severity?: "error" | "warning" | "info";
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export const ConfirmDialog = ({
  open,
  title = "Confirmar ação",
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  severity = "error",
  loading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={() => !loading && onClose()}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            p: 1,
            maxWidth: 420,
            width: "100%",
            boxShadow: "0 12px 36px rgba(0, 0, 0, 0.2)",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          pb: 1,
          pt: 2,
        }}
      >
        <Avatar
          sx={{
            bgcolor: (theme) =>
              alpha(
                theme.palette[severity].main,
                theme.palette.mode === "dark" ? 0.2 : 0.1,
              ),
            color: `${severity}.main`,
            width: 44,
            height: 44,
          }}
        >
          <WarningIcon sx={{ fontSize: 24 }} />
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Esta ação não poderá ser desfeita
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {typeof message === "string" ? (
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
        ) : (
          message
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1 }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={onClose}
          disabled={loading}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {cancelLabel}
        </Button>
        <Button
          variant="contained"
          color={severity}
          onClick={onConfirm}
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress size={16} color="inherit" />
            ) : severity === "error" ? (
              <DeleteIcon sx={{ fontSize: 18 }} />
            ) : null
          }
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: (theme) =>
              `0 4px 12px ${alpha(theme.palette[severity].main, 0.35)}`,
          }}
        >
          {loading ? "Processando..." : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
