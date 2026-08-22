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
import { Link as RouterLink, useNavigate } from "react-router";
import {
  EmailIcon,
  LockIcon,
  PersonIcon,
  VisibilityIcon,
  VisibilityOffIcon,
} from "../components/ui/icons";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("As senhas informadas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve conter pelo menos 6 caracteres.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Registration feedback
      setSuccess("Conta criada com sucesso! Redirecionando para o login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch {
      setError("Não foi possível criar a conta. Tente novamente mais tarde.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <title>Meus Pila - Criar Conta</title>
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 460,
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
              Crie sua conta
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Preencha os dados abaixo para começar
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleRegister}
            noValidate
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {error && (
              <Alert
                severity="error"
                sx={{ borderRadius: 2, fontSize: "0.85rem" }}
              >
                {error}
              </Alert>
            )}

            {success && (
              <Alert
                severity="success"
                sx={{ borderRadius: 2, fontSize: "0.85rem" }}
              >
                {success}
              </Alert>
            )}

            <TextField
              label="Nome completo"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              autoFocus
              placeholder="Ex: João da Silva"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon
                        sx={{ fontSize: 20, color: "text.secondary" }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              fullWidth
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
              required
              fullWidth
              placeholder="Mínimo 6 caracteres"
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

            <TextField
              label="Confirmar Senha"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
              placeholder="Repita a senha"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon
                        sx={{ fontSize: 20, color: "text.secondary" }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting || !name || !email || !password || !confirmPassword}
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
              {isSubmitting ? "Criando conta..." : "Criar Conta"}
            </Button>

            <Stack
              direction="row"
              spacing={0.5}
              sx={{ justifyContent: "center", alignItems: "center", mt: 1 }}
            >
              <Typography variant="body2" color="text.secondary">
                Já possui uma conta?
              </Typography>
              <Link
                component={RouterLink}
                to="/login"
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "primary.main",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Faça login
              </Link>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default Register;
