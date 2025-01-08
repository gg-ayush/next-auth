import { authConfig } from "@/auth/config";
import { db } from '@/lib/db';
import { hashApiKey } from '@/lib/key-generator';
import NextAuth from "next-auth";
import { NextRequest, NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3001',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Public-Key, X-Secret-Key',
};

export const { auth } = NextAuth(authConfig);

export default auth(async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isAuth = !!req.auth;
  const isUser = pathname.startsWith("/user");
  const isAdmin = pathname.startsWith("/admin");
  const isApiRoute = pathname.startsWith("/api");
  const unprotectedRoutes = ["/login", "/register"];

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { 
      status: 200,
      headers: corsHeaders,
    });
  }

  // For API routes, add CORS headers and verify API key
  if (isApiRoute) {
    try {
      const apiKeyResponse = await verifyApiKey(req);
      // Add CORS headers to the response
      Object.entries(corsHeaders).forEach(([key, value]) => {
        apiKeyResponse.headers.set(key, value);
      });
      return apiKeyResponse;
    } catch (error) {
      console.error('API route middleware error:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Internal server error' }),
        { 
          status: 500, 
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      );
    }
  }

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

async function verifyApiKey(req: NextRequest) {
  const publicKey = req.headers.get('X-Public-Key');
  const secretKey = req.headers.get('X-Secret-Key');

  if (!publicKey || !secretKey) {
    return new NextResponse(
      JSON.stringify({ error: 'Missing API key' }),
      { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }

  try {
    const verificationResponse = await fetch(`${req.nextUrl.origin}/api/verify-key`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Public-Key': publicKey,
        'X-Secret-Key': secretKey,
      },
    });

    if (!verificationResponse.ok) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid API key' }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const { applicationId, developerId, developerRole } = await verificationResponse.json();

    // Create a new request with modified headers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('X-Application-Id', applicationId);
    requestHeaders.set('X-Developer-Id', developerId);
    requestHeaders.set('X-Developer-Role', developerRole);

    // Return the modified request
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error('API Key verification error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};

