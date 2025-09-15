export type Role = "SUPER_ADMIN" | "ADMIN" | "VENDOR" | "USER";

const Permissions = {
  viewAdminSidebar: ["SUPER_ADMIN", "ADMIN"],
};
type permissionsType = keyof typeof Permissions;

export function hasAccess(userRole: Role, permission: permissionsType): boolean {
  if (!userRole) return false;
  return Permissions[permission].includes(userRole);
}
