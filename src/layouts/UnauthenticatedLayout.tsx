import { Outlet, Link as RouterLink } from "react-router";
import {
  Avatar,
  Box,
  Container,
  Link,
  Stack,
  Typography,
  alpha,
} from "@mui/material";

const UnauthenticatedLayout = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: "-15%",
          right: "-10%",
          width: "50vw",
          height: "50vw",
          borderRadius: "50%",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "radial-gradient(circle, rgba(59, 105, 255, 0.15) 0%, rgba(0,0,0,0) 70%)"
              : "radial-gradient(circle, rgba(59, 105, 255, 0.12) 0%, rgba(255,255,255,0) 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: "-15%",
          left: "-10%",
          width: "50vw",
          height: "50vw",
          borderRadius: "50%",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, rgba(0,0,0,0) 70%)"
              : "radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, rgba(255,255,255,0) 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        },
      }}
    >
      {/* Top Header */}
      <Box
        component="header"
        sx={{
          py: 3,
          px: { xs: 2.5, sm: 4 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 1,
        }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: "none",
            color: "inherit",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "primary.main",
              color: "#ffffff",
              width: 36,
              height: 36,
              fontWeight: 800,
              borderRadius: 2,
              boxShadow: (theme) =>
                `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
            }}
          >
            P
          </Avatar>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, fontSize: "1.1rem", lineHeight: 1.1 }}
            >
              Meus Pila
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.7rem", fontWeight: 500 }}
            >
              Gestão Financeira
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Link
            component={RouterLink}
            to="/about"
            variant="body2"
            underline="hover"
            sx={{ color: "text.secondary", fontWeight: 500 }}
          >
            Sobre
          </Link>
        </Stack>
      </Box>

      {/* Main Outlet */}
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
          px: 2,
          zIndex: 1,
        }}
      >
        <Outlet />
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          textAlign: "center",
          zIndex: 1,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} Meus Pila — Todos os direitos reservados.
        </Typography>
      </Box>
    </Box>
  );
};

export default UnauthenticatedLayout;
