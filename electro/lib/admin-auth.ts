export const ADMIN_AUTH_COOKIE = "meatnspice_admin_auth";

export function getAdminSessionToken() {
  return process.env.ADMIN_SESSION_TOKEN || "dev-admin-session-token-change-me";
}
