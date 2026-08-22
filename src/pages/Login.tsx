import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import { useAuth } from "../features/authentication";
import { Link as RouterLink, Navigate, useLocation, useNavigate } from "react-router";
import {
  EmailIcon,
  LockIcon,
  VisibilityIcon,
  VisibilityOffIcon,
} from "../components/ui/icons";

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("leobarcelos12@gmail.com");
  const [password, setPassword] = useState("Senha@12345");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch {
      setError("Email ou senha inválidos. Por favor, verifique suas credenciais.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <>
      <title>Meus Pila - Login</title>
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 440,
          borderRadius: 3.5,
          border: "1px solid",
          borderColor: "divider",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)"
              : "#ffffff",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 16px 48px rgba(0, 0, 0, 0.4)"
              : "0 12px 36px rgba(0, 0, 0, 0.08)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <Typography
              variant="h5"
              component="h1"
              sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}
            >
              Bem-vindo de volta!
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Insira suas credenciais para acessar o sistema
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleLogin}
            noValidate
            sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            {error && (
              <Alert
                severity="error"
                sx={{ borderRadius: 2, fontSize: "0.85rem" }}
              >
                {error}
              </Alert>
            )}

            <TextField
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              fullWidth
              autoFocus
              placeholder="seuemail@exemplo.com"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon
                        sx={{ fontSize: 20, color: "text.secondary" }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              label="Senha"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              fullWidth
              placeholder="••••••••"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon
                        sx={{ fontSize: 20, color: "text.secondary" }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon sx={{ fontSize: 18 }} />
                        ) : (
                          <VisibilityIcon sx={{ fontSize: 18 }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting || !email || !password}
              fullWidth
              sx={{
                py: 1.3,
                fontSize: "0.95rem",
                fontWeight: 600,
                borderRadius: 2,
                mt: 1,
                boxShadow: (theme) =>
                  `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
              }}
            >
              {isSubmitting ? "Acessando..." : "Entrar"}
            </Button>

            <Stack
              direction="row"
              spacing={0.5}
              sx={{ justifyContent: "center", alignItems: "center", mt: 1 }}
            >
              <Typography variant="body2" color="text.secondary">
                Não tem uma conta?
              </Typography>
              <Link
                component={RouterLink}
                to="/register"
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "primary.main",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Cadastre-se
              </Link>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default Login;
