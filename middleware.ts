import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

import {
  ADMIN_LOGIN_PATH,
  isAdminLoginPath,
} from "@/lib/admin/admin-routes"

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
      signIn: ADMIN_LOGIN_PATH,
    },
  }
)

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/leseb-admin",
    "/leseb-admin/:path*",
    "/adminopia",
    "/adminopia/:path*",
  ],
}
