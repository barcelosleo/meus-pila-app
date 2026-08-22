import { useState, type MouseEvent } from "react";
import { Outlet, useLocation, useNavigate, Link as RouterLink } from "react-router";
import {
  Avatar,
  Box,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useAuth } from "../features/authentication";
import {
  DashboardIcon,
  GroupIcon,
  LogoutIcon,
  MenuIcon,
  PeopleIcon,
  ShieldIcon,
} from "../components/ui/icons";

const SIDEBAR_WIDTH = 260;

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactElement;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", to: "/", icon: <DashboardIcon /> },
  { label: "Usuários", to: "/users", icon: <PeopleIcon /> },
  { label: "Grupos", to: "/groups", icon: <GroupIcon /> },
  { label: "Sobre o Sistema", to: "/about", icon: <ShieldIcon /> },
];

const RootLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
    navigate("/login");
  };

  const userDisplayName = user?.name || user?.email?.split("@")[0] || "Usuário";
  const userInitial = userDisplayName.charAt(0).toUpperCase();

  const sidebarContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#0f1523" : "#ffffff",
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Brand Header */}
      <Box
        sx={{
          p: 2.5,
          px: 3,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Avatar
          sx={{
            bgcolor: "primary.main",
            color: "#ffffff",
            width: 38,
            height: 38,
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
            sx={{
              fontWeight: 800,
              fontSize: "1.15rem",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            Meus Pila
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 500,
              fontSize: "0.725rem",
            }}
          >
            Gestão & Controle
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Navigation Links */}
      <Box sx={{ flexGrow: 1, py: 2, px: 1.5 }}>
        <Typography
          variant="caption"
          sx={{
            px: 1.5,
            py: 1,
            display: "block",
            color: "text.secondary",
            fontWeight: 700,
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Menu Principal
        </Typography>

        <List sx={{ pt: 0.5 }}>
          {navItems.map((item) => {
            const isActive =
              item.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.to);

            return (
              <ListItem key={item.to} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={RouterLink}
                  to={item.to}
                  onClick={() => isMobile && setMobileOpen(false)}
                  sx={{
                    borderRadius: 2,
                    py: 1.1,
                    px: 1.5,
                    transition: "all 0.15s ease-in-out",
                    bgcolor: isActive
                      ? (theme) =>
                          theme.palette.mode === "dark"
                            ? alpha(theme.palette.primary.main, 0.2)
                            : alpha(theme.palette.primary.main, 0.1)
                      : "transparent",
                    color: isActive ? "primary.main" : "text.primary",
                    fontWeight: isActive ? 700 : 500,
                    "&:hover": {
                      bgcolor: (theme) =>
                        isActive
                          ? theme.palette.mode === "dark"
                            ? alpha(theme.palette.primary.main, 0.25)
                            : alpha(theme.palette.primary.main, 0.15)
                          : alpha(theme.palette.action.hover, 0.08),
                      transform: "translateX(2px)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: isActive ? "primary.main" : "text.secondary",
                      "& svg": { fontSize: 20 },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: "0.875rem",
                      fontWeight: isActive ? 600 : 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Divider />

      {/* User Mini Profile in Sidebar Footer */}
      <Box sx={{ p: 2, bgcolor: (theme) => alpha(theme.palette.action.hover, 0.02) }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              fontSize: "0.875rem",
              fontWeight: 700,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.15),
              color: "primary.main",
            }}
          >
            {userInitial}
          </Avatar>
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                fontSize: "0.825rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {userDisplayName}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: "0.725rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "block",
              }}
            >
              {user?.email || "conectado"}
            </Typography>
          </Box>
          <Tooltip title="Sair" arrow>
            <IconButton
              size="small"
              onClick={handleLogout}
              sx={{
                color: "text.secondary",
                "&:hover": { color: "error.main", bgcolor: alpha(theme.palette.error.main, 0.1) },
              }}
            >
              <LogoutIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Mobile Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: SIDEBAR_WIDTH,
              border: "none",
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      ) : (
        /* Desktop Persistent Sidebar */
        <Box
          component="nav"
          sx={{
            width: SIDEBAR_WIDTH,
            flexShrink: 0,
            display: { xs: "none", md: "block" },
          }}
        >
          <Drawer
            variant="permanent"
            open
            sx={{
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: SIDEBAR_WIDTH,
                borderRight: "1px solid",
                borderColor: "divider",
              },
            }}
          >
            {sidebarContent}
          </Drawer>
        </Box>
      )}

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          minHeight: "100vh",
        }}
      >
        {/* Top App Header */}
        <Box
          component="header"
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1100,
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(17, 24, 39, 0.85)"
                : "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Toolbar
            sx={{
              px: { xs: 2, sm: 3 },
              justifyContent: "space-between",
              minHeight: "64px !important",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="abrir menu"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              )}

              {/* Breadcrumb / Title Context in Header for mobile */}
              {isMobile && (
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
                  Meus Pila
                </Typography>
              )}
            </Box>

            {/* Right Header Actions & Profile */}
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Tooltip title="Minha Conta" arrow>
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{
                    p: 0.5,
                    border: "2px solid",
                    borderColor: "primary.main",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      bgcolor: "primary.main",
                      color: "#ffffff",
                    }}
                  >
                    {userInitial}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                id="user-menu"
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleCloseUserMenu}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                slotProps={{
                  paper: {
                    sx: {
                      width: 220,
                      borderRadius: 2.5,
                      mt: 1,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                      p: 0.5,
                    },
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                    {userDisplayName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ wordBreak: "break-all" }}>
                    {user?.email || "Usuário autenticado"}
                  </Typography>
                </Box>

                <Divider sx={{ my: 0.5 }} />

                <MenuItem
                  component={RouterLink}
                  to="/about"
                  onClick={handleCloseUserMenu}
                  sx={{ borderRadius: 1.5, fontSize: "0.875rem", py: 1 }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <ShieldIcon sx={{ fontSize: 18 }} />
                  </ListItemIcon>
                  Sobre o Sistema
                </MenuItem>

                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    borderRadius: 1.5,
                    fontSize: "0.875rem",
                    py: 1,
                    color: "error.main",
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32, color: "error.main" }}>
                    <LogoutIcon sx={{ fontSize: 18 }} />
                  </ListItemIcon>
                  Sair
                </MenuItem>
              </Menu>
            </Stack>
          </Toolbar>
        </Box>

        {/* Page Content Viewport */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: { xs: 2.5, sm: 3.5 },
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Container maxWidth="xl" disableGutters>
            <Outlet />
          </Container>
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 2,
            px: 3,
            mt: "auto",
            borderTop: "1px solid",
            borderColor: "divider",
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "#0b0f19" : "#ffffff",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              © {new Date().getFullYear()} Meus Pila — Sistema de Gestão Financeira
            </Typography>
            <Typography variant="caption" color="text.disabled">
              Versão 1.0.0
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default RootLayout;
