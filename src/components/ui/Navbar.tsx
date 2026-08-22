import { useState, type MouseEvent, type ReactNode } from "react";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router";
import { MenuIcon } from "./icons";

export interface NavbarItem {
  label: string;
  to?: string;
  onClick?: () => void;
  icon?: ReactNode;
}

export interface NavbarProps {
  logo?: ReactNode;
  title?: string;
  titleTo?: string;
  items?: NavbarItem[];
  actions?: ReactNode;
  color?: "default" | "primary" | "secondary" | "transparent";
  position?: "fixed" | "absolute" | "sticky" | "static" | "relative";
}

const Navbar = ({
  logo,
  title,
  titleTo = "/",
  items = [],
  actions,
  color = "primary",
  position = "static",
}: NavbarProps) => {
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<HTMLElement | null>(
    null,
  );

  const handleOpenMobileMenu = (event: MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleCloseMobileMenu = () => {
    setMobileMenuAnchor(null);
  };

  const handleItemClick = (item: NavbarItem) => {
    handleCloseMobileMenu();
    item.onClick?.();
  };

  return (
    <AppBar position={position} color={color}>
      <Toolbar>
        {logo && <Box sx={{ display: "flex", mr: 1 }}>{logo}</Box>}

        {title && (
          <Typography
            variant="h6"
            component={titleTo ? RouterLink : "div"}
            to={titleTo}
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            {title}
          </Typography>
        )}

        {!title && <Box sx={{ flexGrow: 1 }} />}

        {items.length > 0 && (
          <>
            {/* desktop nav items */}
            <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1 }}>
              {items.map((item) => (
                <Button
                  key={item.label}
                  color="inherit"
                  startIcon={item.icon}
                  component={item.to ? RouterLink : "button"}
                  to={item.to}
                  onClick={() => handleItemClick(item)}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* mobile nav menu */}
            <Box sx={{ display: { xs: "flex", sm: "none" } }}>
              <IconButton
                color="inherit"
                aria-label="open navigation menu"
                aria-controls="navbar-mobile-menu"
                aria-haspopup="true"
                onClick={handleOpenMobileMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="navbar-mobile-menu"
                anchorEl={mobileMenuAnchor}
                open={Boolean(mobileMenuAnchor)}
                onClose={handleCloseMobileMenu}
              >
                {items.map((item) => (
                  <MenuItem
                    key={item.label}
                    component={item.to ? RouterLink : "li"}
                    to={item.to}
                    onClick={() => handleItemClick(item)}
                  >
                    {item.icon && (
                      <Box sx={{ display: "flex", mr: 1 }}>{item.icon}</Box>
                    )}
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </>
        )}

        {actions && (
          <Box sx={{ ml: 2, display: "flex", gap: 1 }}>{actions}</Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
