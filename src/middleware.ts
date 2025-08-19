import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import { Role } from "./types/role";
import { COOKIE_NAME } from "./constants/cookieName";

export function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get(COOKIE_NAME.REFRESH_TOKEN)?.value;
  const { pathname } = request.nextUrl;

  // Các route public
  const publicRoutes = ["/", "/admin/login"];
  const isPublicRoute = publicRoutes.includes(pathname);

  if (!refreshToken) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  try {
    const payload = jwtDecode(refreshToken) as { role?: Role };

    if (pathname === "/admin/login" && payload.role === Role.ADMIN) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (payload.role === Role.ADMIN) {
      if (pathname === "/") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      if (pathname.startsWith("/admin")) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    // Nếu user
    if (payload.role === Role.USER) {
      if (pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|ico)).*)",
  ],
};
