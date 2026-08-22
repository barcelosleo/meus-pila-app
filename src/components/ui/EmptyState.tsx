import { type ReactNode } from "react";
import { Avatar, Box, Button, Typography, alpha } from "@mui/material";
import { SearchIcon } from "./icons";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  title = "Nenhum item encontrado",
  description = "Não há dados para exibir no momento.",
  icon,
  action,
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        px: 3,
        textAlign: "center",
      }}
    >
      <Avatar
        sx={{
          width: 56,
          height: 56,
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.05)"
              : alpha(theme.palette.primary.main, 0.08),
          color: "text.secondary",
          mb: 2,
        }}
      >
        {icon || <SearchIcon sx={{ fontSize: 30 }} />}
      </Avatar>

      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: "text.primary",
          mb: 0.5,
          fontSize: "1.1rem",
        }}
      >
        {title}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          maxWidth: 420,
          mb: action || onAction ? 2.5 : 0,
          fontSize: "0.875rem",
        }}
      >
        {description}
      </Typography>

      {action ||
        (onAction && actionLabel && (
          <Button
            variant="contained"
            onClick={onAction}
            sx={{
              borderRadius: 2,
              px: 3,
              fontWeight: 600,
            }}
          >
            {actionLabel}
          </Button>
        ))}
    </Box>
  );
};
