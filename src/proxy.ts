// proxy.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { UserRole } from "./generated/prisma/enums";

export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;
  const { pathname } = nextUrl;

  /**
   * ----------------------------
   * PUBLIC ROUTES
   * ----------------------------
   */
  const isPublicRoute =
    pathname === "/login" ||
    pathname.startsWith("/api/chat") ||
    pathname.startsWith("/chatbot");

  if (isPublicRoute) return NextResponse.next();

  /**
   * ----------------------------
   * AUTH GUARD
   * ----------------------------
   */
  if (!session?.user) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = session.user.role;

  /**
   * ----------------------------
   * SUPER ADMIN → FULL ACCESS
   * ----------------------------
   */
  if (role === UserRole.SUPER_ADMIN) {
    return NextResponse.next();
  }

  /**
   * ----------------------------
   * ADMIN PROTECTION RULES
   * ----------------------------
   */
  if (role === UserRole.ADMIN) {
    const blockedPrefixes = [
      "/dashboard/settings",
      "/dashboard/users",

      // API restrictions
      "/api/settings",
      "/api/users",
    ];

    const isBlocked = blockedPrefixes.some(
      (path) =>
        pathname === path || pathname.startsWith(`${path}/`)
    );

    if (isBlocked) {
      return NextResponse.redirect(
        new URL("/unauthorized", nextUrl)
      );
    }
  }

  /**
   * ----------------------------
   * DEFAULT ALLOW
   * ----------------------------
   */
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|images).*)",
  ],
};