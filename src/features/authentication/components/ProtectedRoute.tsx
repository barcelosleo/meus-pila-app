import { useAuth } from "../hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router";
import { Avatar, Box, CircularProgress, Typography, alpha } from "@mui/material";

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2.5,
          bgcolor: "background.default",
        }}
      >
        <Avatar
          sx={{
            bgcolor: "primary.main",
            color: "#ffffff",
            width: 56,
            height: 56,
            fontWeight: 800,
            fontSize: "1.5rem",
            borderRadius: 3,
            boxShadow: (theme) =>
              `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
            animation: "pulse 2s infinite ease-in-out",
            "@keyframes pulse": {
              "0%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.06)" },
              "100%": { transform: "scale(1)" },
            },
          }}
        >
          P
        </Avatar>

        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}>
          Meus Pila
        </Typography>

        <CircularProgress size={24} thickness={4} color="primary" />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
