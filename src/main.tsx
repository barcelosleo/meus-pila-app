import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { ThemeProvider, CssBaseline } from "@mui/material";
import About from "./pages/About.tsx";
import Home from "./pages/Home.tsx";
import AuthLayout from "./layouts/AuthLayout.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import RootLayout from "./layouts/RootLayout.tsx";
import { AuthProvider, ProtectedRoute } from "./features/authentication";
import { Logout } from "./pages/Logout.tsx";
import { theme } from "./lib/theme.ts";
import { GroupsPage } from "./pages/Groups.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme} defaultMode="system">
      <CssBaseline />
      <AuthProvider baseUrl={import.meta.env.API_HOST}>
        <BrowserRouter>
          <Routes>
            <Route element={<RootLayout />}>
              <Route element={<ProtectedRoute />}>
                <Route index element={<Home />} />
                <Route path="/users" element={<div>Users Page</div>} />
                <Route path="/groups" element={<GroupsPage />} />
              </Route>
            </Route>
            <Route element={<AuthLayout />}>
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
