import { Outlet, useNavigate } from "react-router";
import { Box, Button, Container } from "@mui/material";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import { useAuth } from "../features/authentication";

const RootLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <title>Meus Pila</title>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100svh" }}
      >
        <Navbar
          //   logo={<img src="/logo.svg" height={32} />}
          title="Meus Pila"
          position="sticky"
          items={[
            { label: "Início", to: "/" },
            { label: "Usuários", to: "/users" },
            { label: "Grupos", to: "/groups" },
          ]}
          actions={
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          }
        />
        <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
          <Outlet />
        </Container>
        <Footer />
      </Box>
    </>
  );
};

export default RootLayout;
