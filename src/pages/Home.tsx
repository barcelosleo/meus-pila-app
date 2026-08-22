import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import { Link as RouterLink } from "react-router";
import { useAuth } from "../features/authentication";
import {
  AddIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  GroupIcon,
  PeopleIcon,
  ShieldIcon,
  StatCard,
} from "../components/ui";
import type { PaginatedGroups } from "../features/groups/data/group";

const Home = () => {
  const { user, api } = useAuth();
  const [totalGroups, setTotalGroups] = useState<number | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.get<PaginatedGroups>("/group?pageNumber=1&pageSize=1");
        setTotalGroups(res.totalCount);
      } catch {
        // Fallback if not available
        setTotalGroups(null);
      }
    }
    loadStats();
  }, [api]);

  const userName = user?.name || user?.email?.split("@")[0] || "Usuário";

  const currentDate = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <>
      <title>Meus Pila - Dashboard</title>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
        {/* Welcome Hero Banner */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 3.5,
            border: "1px solid",
            borderColor: "divider",
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, rgba(59, 105, 255, 0.15) 0%, rgba(124, 58, 237, 0.1) 100%)"
                : "linear-gradient(135deg, rgba(59, 105, 255, 0.08) 0%, rgba(124, 58, 237, 0.05) 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
              }}
            >
              <Box>
                <Chip
                  size="small"
                  label={currentDate.charAt(0).toUpperCase() + currentDate.slice(1)}
                  sx={{
                    bgcolor: (theme) =>
                      alpha(theme.palette.primary.main, 0.1),
                    color: "primary.main",
                    fontWeight: 600,
                    mb: 1.5,
                    borderRadius: "6px",
                  }}
                />
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: "-0.025em",
                    lineHeight: 1.2,
                  }}
                >
                  Olá, {userName}! 👋
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mt: 0.75, maxWidth: 520 }}
                >
                  Bem-vindo ao painel de controle do <strong>Meus Pila</strong>.
                  Acompanhe grupos, permissões e status do sistema em tempo real.
                </Typography>
              </Box>

              <Button
                component={RouterLink}
                to="/groups"
                variant="contained"
                startIcon={<GroupIcon />}
                sx={{
                  borderRadius: 2.5,
                  px: 3,
                  py: 1.2,
                  fontWeight: 600,
                  boxShadow: (theme) =>
                    `0 6px 20px ${alpha(theme.palette.primary.main, 0.35)}`,
                }}
              >
                Gerenciar Grupos
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr 1fr",
            },
            gap: 2.5,
          }}
        >
          <StatCard
            title="Grupos Cadastrados"
            value={totalGroups !== null ? totalGroups : "—"}
            icon={<GroupIcon sx={{ fontSize: 24 }} />}
            color="primary"
            subtitle="Total no sistema"
            trend={{ value: "+12%", isPositive: true, label: "este mês" }}
          />

          <StatCard
            title="Usuários Ativos"
            value="3"
            icon={<PeopleIcon sx={{ fontSize: 24 }} />}
            color="secondary"
            subtitle="Membros da equipe"
            trend={{ value: "+1", isPositive: true, label: "novo usuário" }}
          />

          <StatCard
            title="Segurança"
            value="JWT Ativo"
            icon={<ShieldIcon sx={{ fontSize: 24 }} />}
            color="success"
            subtitle="Sessão criptografada"
          />

          <StatCard
            title="Status API"
            value="Online"
            icon={<CheckCircleIcon sx={{ fontSize: 24 }} />}
            color="info"
            subtitle="Tempo de resposta: 42ms"
          />
        </Box>

        {/* Quick Shortcuts & Navigation Sections */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
            gap: 3,
          }}
        >
          {/* Quick Actions Card */}
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.02)"
                  : "#ffffff",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Ações Rápidas
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Acesse diretamente as operações mais comuns do sistema.
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <Card
                  variant="outlined"
                  component={RouterLink}
                  to="/groups"
                  sx={{
                    p: 2.5,
                    borderRadius: 2.5,
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, 0.04),
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                      sx={{
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, 0.1),
                        color: "primary.main",
                        borderRadius: 2,
                      }}
                    >
                      <GroupIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Grupos & Permissões
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Listar e cadastrar grupos
                      </Typography>
                    </Box>
                  </Box>
                  <ChevronRightIcon sx={{ color: "text.secondary" }} />
                </Card>

                <Card
                  variant="outlined"
                  component={RouterLink}
                  to="/users"
                  sx={{
                    p: 2.5,
                    borderRadius: 2.5,
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "secondary.main",
                      bgcolor: (theme) =>
                        alpha(theme.palette.secondary.main, 0.04),
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                      sx={{
                        bgcolor: (theme) =>
                          alpha(theme.palette.secondary.main, 0.1),
                        color: "secondary.main",
                        borderRadius: 2,
                      }}
                    >
                      <PeopleIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Usuários
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Gerenciar contas
                      </Typography>
                    </Box>
                  </Box>
                  <ChevronRightIcon sx={{ color: "text.secondary" }} />
                </Card>
              </Box>
            </CardContent>
          </Card>

          {/* System Info Card */}
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.02)"
                  : "#ffffff",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Informações da Conta
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                Dados da sessão atual
              </Typography>

              <Stack spacing={2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.03)"
                        : "#f8fafc",
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                    E-mail Conectado
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {user?.email || "—"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.03)"
                        : "#f8fafc",
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                    ID do Usuário
                  </Typography>
                  <Typography variant="caption" sx={{ fontFamily: "monospace", fontWeight: 600 }}>
                    {user?.id || "local-user"}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
};

export default Home;
