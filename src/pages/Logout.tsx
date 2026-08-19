import { Navigate } from "react-router";
import { useAuth } from "../features/authentication";
import { useEffect } from "react";

export const Logout = () => {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return <Navigate to="/login" replace />;
};
