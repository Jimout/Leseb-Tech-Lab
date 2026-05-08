import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

function isAdminLoginPath(pathname: string): boolean {
  return (
    pathname === "/admin/login" ||
    pathname.startsWith("/admin/login/") ||
    pathname === "/adminopia/login" ||
    pathname.startsWith("/adminopia/login/")
  )
}

export default withAuth(
  function middleware() {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const pathname = req.nextUrl.pathname
        if (isAdminLoginPath(pathname)) return true
        return !!token
      },
    },
    pages: {
      signIn: "/adminopia/login",
    },
  }
)

export const config = {
  matcher: ["/admin", "/admin/:path*", "/adminopia", "/adminopia/:path*"],
}
