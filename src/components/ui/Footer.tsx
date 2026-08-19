import { Box, Container, Link, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        mt: "auto",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Meus Pila
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Link
            href="/about"
            variant="body2"
            color="text.secondary"
            underline="hover"
          >
            Sobre
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
