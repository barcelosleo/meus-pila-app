import { type ReactNode } from "react";
import {
  Avatar,
  Box,
  Breadcrumbs,
  Chip,
  IconButton,
  Link,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import { Link as RouterLink } from "react-router";
import { ArrowBackIcon, ChevronRightIcon, HomeIcon } from "./icons";

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  badge?: string | number;
  badgeColor?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "default";
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  onBack?: () => void;
}

export const PageHeader = ({
  title,
  subtitle,
  icon,
  badge,
  badgeColor = "primary",
  breadcrumbs = [],
  actions,
  onBack,
}: PageHeaderProps) => {
  return (
    <Box sx={{ mb: 3.5 }}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={
            <ChevronRightIcon sx={{ fontSize: 14, color: "text.disabled" }} />
          }
          aria-label="breadcrumb"
          sx={{ mb: 1.5, fontSize: "0.825rem" }}
        >
          <Link
            component={RouterLink}
            to="/"
            underline="hover"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "text.secondary",
              fontWeight: 500,
              "&:hover": { color: "primary.main" },
            }}
          >
            <HomeIcon sx={{ fontSize: 16 }} />
            Início
          </Link>

          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            if (isLast || !item.to) {
              return (
                <Typography
                  key={item.label}
                  color="text.primary"
                  sx={{ fontWeight: 600, fontSize: "0.825rem" }}
                >
                  {item.label}
                </Typography>
              );
            }

            return (
              <Link
                key={item.label}
                component={RouterLink}
                to={item.to}
                underline="hover"
                sx={{
                  color: "text.secondary",
                  fontWeight: 500,
                  "&:hover": { color: "primary.main" },
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}

      {/* Main Header Content */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {onBack && (
            <IconButton
              onClick={onBack}
              size="small"
              sx={{
                bgcolor: (theme) => alpha(theme.palette.text.primary, 0.04),
                borderRadius: 2,
                p: 1,
                "&:hover": {
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                },
              }}
            >
              <ArrowBackIcon sx={{ fontSize: 20 }} />
            </IconButton>
          )}

          {icon && (
            <Avatar
              sx={{
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.primary.main, 0.2)
                    : alpha(theme.palette.primary.main, 0.1),
                color: "primary.main",
                width: 48,
                height: 48,
                borderRadius: 2.5,
              }}
            >
              {icon}
            </Avatar>
          )}

          <Box>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "-0.025em",
                  fontSize: { xs: "1.5rem", sm: "1.75rem" },
                }}
              >
                {title}
              </Typography>

              {badge !== undefined && (
                <Chip
                  size="small"
                  label={badge}
                  color={badgeColor}
                  variant="outlined"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    height: 24,
                    borderRadius: "6px",
                  }}
                />
              )}
            </Stack>

            {subtitle && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, fontSize: "0.875rem" }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        {actions && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              alignSelf: { xs: "stretch", sm: "auto" },
            }}
          >
            {actions}
          </Box>
        )}
      </Stack>
    </Box>
  );
};
