// Open string type so the backend can introduce new roles without a frontend type change.
export type Role = "Admin" | "User" | (string & {});

export const ROLES = {
  ADMIN: "Admin",
  USER: "User",
} as const;

export const hasRole = (
  user: { role: Role } | null | undefined,
  allowed: Role[],
): boolean => {
  if (!user) return false;
  return allowed.includes(user.role);
};
