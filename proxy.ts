import { NextResponse, NextRequest } from "next/server";

const AdminRoutes = ["/dashboard"];
const AuthRoutes = ["/login", "/register", "/login-vendor", "/register-vendor"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const isLoggedIn = !!token;
  const isAuthRoute = AuthRoutes.includes(request.nextUrl.pathname);
  const isAdminRoute = AdminRoutes.includes(request.nextUrl.pathname);

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
