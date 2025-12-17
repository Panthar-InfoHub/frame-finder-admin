export type Role = "SUPER_ADMIN" | "ADMIN" | "VENDOR" | "USER";

export function isAdminRole(role: Role | undefined): boolean {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

// const Permissions = {
//   viewAdminSidebar: ["SUPER_ADMIN", "ADMIN"],
// };
// type permissionsType = keyof typeof Permissions;

// export function hasAccess(userRole: Role, permission: permissionsType): boolean {
//   if (!userRole) return false;
//   return Permissions[permission].includes(userRole);
// }
