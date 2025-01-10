import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/auth'

// List of allowed origins
const allowedOrigins = ['http://localhost:3001', 'http://localhost:3000']

// Helper function to check if origin is allowed
function isOriginAllowed(origin: string | null) {
  return origin && allowedOrigins.includes(origin)
}

export default auth(async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isAuth = !!request.auth
  const isUser = pathname.startsWith("/user")
  const isAdmin = pathname.startsWith("/admin")
  const isApiRoute = pathname.startsWith("/api")
  const unprotectedRoutes = ["/login", "/register"]
  const origin = request.headers.get('origin')

  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    if (!origin || !isOriginAllowed(origin)) {
      return new NextResponse(null, { status: 400 })
    }

    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    })
  }

  // For API routes, check origin
  if (isApiRoute) {
    if (!origin || !isOriginAllowed(origin)) {
      return new NextResponse(null, { status: 400 })
    }

    // Continue with the request but add CORS headers
    const response = NextResponse.next()
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  }

  // Handle authentication for non-API routes
  if (!isAuth && !unprotectedRoutes.includes(pathname)) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  // Handle role-based access
  if (isUser && request.auth?.user?.role !== "User") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (isAdmin && request.auth?.user?.role !== "Developer") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
}

