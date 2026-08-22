import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import { Link as RouterLink } from "react-router";
import {
  ArrowBackIcon,
  CheckCircleIcon,
  GroupIcon,
  LockIcon,
  PeopleIcon,
  ShieldIcon,
  TrendingUpIcon,
} from "../components/ui/icons";

const features = [
  {
    icon: <GroupIcon sx={{ fontSize: 24 }} />,
    title: "Gestão de Grupos",
    description:
      "Crie e gerencie grupos com facilidade, organizando usuários e permissões de forma rápida e segura.",
    color: "primary" as const,
  },
  {
    icon: <PeopleIcon sx={{ fontSize: 24 }} />,
    title: "Controle de Usuários",
    description:
      "Administre o ciclo de vida dos usuários, níveis de acesso e credenciais da sua equipe em um único painel.",
    color: "secondary" as const,
  },
  {
    icon: <LockIcon sx={{ fontSize: 24 }} />,
    title: "Autenticação Segura",
    description:
      "Sessões protegidas via tokens JWT com rotação e renovação segura para garantir a integridade dos dados.",
    color: "warning" as const,
  },
  {
    icon: <TrendingUpIcon sx={{ fontSize: 24 }} />,
    title: "Performance & UX",
    description:
      "Interface baseada em Material Design 3, ágil, responsiva, com suporte a temas e paginação via servidor.",
    color: "success" as const,
  },
];

const techStack = [
  "React 19",
  "Material UI (MUI v9)",
  "MUI X DataGrid",
  "React Router v8",
  "TypeScript",
  "Vite",
];

const About = () => {
  return (
    <>
      <title>Meus Pila - Sobre o Sistema</title>
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Avatar
            sx={{
              bgcolor: "primary.main",
              color: "#ffffff",
              width: 64,
              height: 64,
              fontWeight: 800,
              fontSize: "1.75rem",
              mx: "auto",
              mb: 2.5,
              borderRadius: 3,
              boxShadow: (theme) =>
                `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
            }}
          >
            P
          </Avatar>
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 800, letterSpacing: "-0.03em", mb: 1.5 }}
          >
            Sobre o Meus Pila
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto", lineHeight: 1.6 }}
          >
            Plataforma moderna de gestão financeira, controle de acessos e
            organização de grupos desenvolvida para simplificar a administração
            do seu negócio.
          </Typography>
        </Box>

        {/* Features Cards */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, mb: 3, textAlign: "center" }}
          >
            Principais Recursos
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2.5,
            }}
          >
            {features.map((feature) => (
              <Card
                key={feature.title}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.02)"
                      : "#ffffff",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: (theme) =>
                      theme.palette.mode === "dark"
                        ? "0 8px 24px rgba(0,0,0,0.3)"
                        : "0 8px 24px rgba(0,0,0,0.05)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: (theme) =>
                        alpha(
                          theme.palette[feature.color].main,
                          theme.palette.mode === "dark" ? 0.2 : 0.1,
                        ),
                      color: `${feature.color}.main`,
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 1, fontSize: "1.05rem" }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.5 }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Tech Stack */}
        <Card
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.02)"
                : "#f8fafc",
            textAlign: "center",
            mb: 5,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            Tecnologias Utilizadas
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            flexWrap="wrap"
            sx={{ justifyContent: "center" }}
          >
            {techStack.map((tech) => (
              <Chip
                key={tech}
                icon={<CheckCircleIcon sx={{ fontSize: "16px !important" }} />}
                label={tech}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.03)"
                      : "#ffffff",
                }}
              />
            ))}
          </Stack>
        </Card>

        {/* Actions */}
        <Box sx={{ textAlign: "center" }}>
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            size="large"
            startIcon={<ArrowBackIcon />}
            sx={{ borderRadius: 2, px: 3.5, fontWeight: 600 }}
          >
            Voltar ao Início
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default About;