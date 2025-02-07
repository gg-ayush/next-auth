import { auth } from "@/auth"
import { NextResponse, type NextRequest } from "next/server"

// Define roles as an enum or constant
enum UserRole {
  Developer = "Developer",
}

// Configuration object

export default auth(async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isAuth = !!request.auth
  const isDashboard = pathname === ({
    unprotectedRoutes: ["/login", "/register", "/"], // Added root route as unprotected
    loginRoute: "/login",
    homeRoute: "/",
    dashboardRoute: "/dashboard",
  }).dashboardRoute
  const isRootRoute = pathname === ({
    unprotectedRoutes: ["/login", "/register", "/"], // Added root route as unprotected
    loginRoute: "/login",
    homeRoute: "/",
    dashboardRoute: "/dashboard",
  }).homeRoute

  // Logging
  console.log(`Middleware processing: ${pathname}`)

  try {
    // Handle root route (default route when application starts)
    if (isRootRoute) {
      console.log("Accessing root route")
      return NextResponse.next() // Allow access to all users
    }

    // Handle authentication for dashboard route
    if (isDashboard) {
      if (!isAuth) {
        console.log(`Redirecting unauthenticated user from dashboard to login`)
        const url = new URL(({
            unprotectedRoutes: ["/login", "/register", "/"], // Added root route as unprotected
            loginRoute: "/login",
            homeRoute: "/",
            dashboardRoute: "/dashboard",
          }).loginRoute, request.url)
        url.searchParams.set("callbackUrl", pathname)
        return NextResponse.redirect(url)
      }

      // Check if the authenticated user is a Developer
      if (request.auth?.user?.role !== UserRole.Developer) {
        console.log(`Redirecting non-Developer user from dashboard`)
        return NextResponse.redirect(new URL(({
            unprotectedRoutes: ["/login", "/register", "/"], // Added root route as unprotected
            loginRoute: "/login",
            homeRoute: "/",
            dashboardRoute: "/dashboard",
          }).homeRoute, request.url))
      }
    }

    // Handle authentication for other protected routes
    if (!isAuth && !({
      unprotectedRoutes: ["/login", "/register", "/"], // Added root route as unprotected
      loginRoute: "/login",
      homeRoute: "/",
      dashboardRoute: "/dashboard",
    }).unprotectedRoutes.includes(pathname)) {
      console.log(`Redirecting unauthenticated user to login`)
      const url = new URL(({
          unprotectedRoutes: ["/login", "/register", "/"], // Added root route as unprotected
          loginRoute: "/login",
          homeRoute: "/",
          dashboardRoute: "/dashboard",
        }).loginRoute, request.url)
      url.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    // Handle the error appropriately, maybe redirect to an error page
    return NextResponse.redirect(new URL("/error", request.url))
  }
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)", "/", "/(api|trpc)(.*)"],
}

