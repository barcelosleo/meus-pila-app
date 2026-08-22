import { type ReactNode } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import { TrendingUpIcon } from "./icons";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  onClick?: () => void;
}

export const StatCard = ({
  title,
  value,
  icon,
  color = "primary",
  subtitle,
  trend,
  onClick,
}: StatCardProps) => {
  return (
    <Card
      elevation={0}
      onClick={onClick}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease-in-out",
        "&:hover": onClick
          ? {
              transform: "translateY(-3px)",
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 8px 24px rgba(0,0,0,0.4)"
                  : "0 8px 24px rgba(0,0,0,0.06)",
              borderColor: `${color}.main`,
            }
          : undefined,
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)"
            : "linear-gradient(180deg, #ffffff 0%, #fcfdfe 100%)",
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{ justifyContent: "space-between", alignItems: "flex-start" }}
        >
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontWeight: 600,
                fontSize: "0.825rem",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, mt: 0.5, letterSpacing: "-0.02em" }}
            >
              {value}
            </Typography>
          </Box>

          <Avatar
            sx={{
              bgcolor: (theme) =>
                alpha(
                  theme.palette[color].main,
                  theme.palette.mode === "dark" ? 0.2 : 0.1,
                ),
              color: `${color}.main`,
              width: 48,
              height: 48,
              borderRadius: 2.5,
            }}
          >
            {icon}
          </Avatar>
        </Stack>

        {(subtitle || trend) && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: 2,
              pt: 1.5,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            {trend && (
              <Chip
                size="small"
                icon={<TrendingUpIcon sx={{ fontSize: "14px !important" }} />}
                label={trend.value}
                color={trend.isPositive ? "success" : "error"}
                sx={{
                  height: 20,
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  borderRadius: "4px",
                }}
              />
            )}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.75rem" }}
            >
              {trend?.label ?? subtitle}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
