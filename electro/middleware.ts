import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { ADMIN_AUTH_COOKIE, getAdminSessionToken } from "@/lib/admin-auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  if (isLoginPage || isLoginApi) {
    return NextResponse.next();
  }

  const authToken = request.cookies.get(ADMIN_AUTH_COOKIE)?.value;
  const isAuthed = authToken === getAdminSessionToken();

  if (isAuthed) {
    return NextResponse.next();
  }

  if (isAdminApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
