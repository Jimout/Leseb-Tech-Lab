import NextAuth from "next-auth"
import { NextResponse } from "next/server"

import { ADMIN_LOGIN_PATH } from "@/lib/admin/admin-routes"
import { authOptions } from "@/lib/auth"
import { ensureNextAuthRuntimeEnv, hasAuthSecret } from "@/lib/auth-env"
import { getSiteUrl } from "@/lib/seo/site-config"

export const runtime = "nodejs"

const nextAuthHandler = NextAuth(authOptions)

function redirectToLogin(errorCode: string) {
  const login = new URL(ADMIN_LOGIN_PATH, getSiteUrl())
  login.searchParams.set("error", errorCode)
  return NextResponse.redirect(login)
}

async function handler(
  req: Parameters<typeof nextAuthHandler>[0],
  context: Parameters<typeof nextAuthHandler>[1],
) {
  ensureNextAuthRuntimeEnv()

  if (process.env.NODE_ENV === "production" && !hasAuthSecret()) {
    console.error("[nextauth] Missing NEXTAUTH_SECRET in production")
    return redirectToLogin("Configuration")
  }

  try {
    return await nextAuthHandler(req, context)
  } catch (error) {
    console.error("[nextauth] handler error:", error)
    return redirectToLogin("Configuration")
  }
}

export { handler as GET, handler as POST }
