import { useAuth } from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router";
import type { Role } from "../data/role";

export const RoleGuard = ({ allow }: { allow: Role[] }) => {
  const { hasRole } = useAuth();

  if (!hasRole(allow)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
};
