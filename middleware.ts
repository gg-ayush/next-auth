import { authConfig } from "@/auth/config";
import NextAuth from "next-auth";
import { NextRequest, NextResponse } from 'next/server';

export const { auth } = NextAuth(authConfig);

export default auth(async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isAuth = !!req.auth;
  const isUser = pathname.startsWith("/user");
  const isAdmin = pathname.startsWith("/admin");
  const isApiRoute = pathname.startsWith("/api");
  const unprotectedRoutes = ["/login", "/register"];

  // Manage route protection for non-API routes
  if (!isAuth && !unprotectedRoutes.includes(pathname) && !isApiRoute) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (isUser && req.auth?.user?.role !== "User") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isAdmin && req.auth?.user?.role !== "Developer") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If all checks pass, proceed with the request
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};

