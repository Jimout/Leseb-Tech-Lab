import NextAuth from "next-auth"
import { NextResponse } from "next/server"

import { ADMIN_LOGIN_PATH } from "@/lib/admin/admin-routes"
import { buildAuthOptions } from "@/lib/auth"
import {
  ensureNextAuthRuntimeEnv,
  isAuthConfiguredForProduction,
} from "@/lib/auth-env"
import { getSiteUrl } from "@/lib/seo/site-config"

export const runtime = "nodejs"

function redirectToLogin(errorCode: string) {
  const login = new URL(ADMIN_LOGIN_PATH, getSiteUrl())
  login.searchParams.set("error", errorCode)
  return NextResponse.redirect(login)
}

type RouteContext = { params: Promise<{ nextauth: string[] }> }

async function handleAuth(req: Request, context: RouteContext) {
  ensureNextAuthRuntimeEnv()

  if (process.env.NODE_ENV === "production" && !isAuthConfiguredForProduction()) {
    console.error("[nextauth] Auth env not configured for production")
    return redirectToLogin("Configuration")
  }

  try {
    const handler = NextAuth(buildAuthOptions())
    const params = await context.params
    return handler(req, { params })
  } catch (error) {
    console.error("[nextauth] handler error:", error)
    return redirectToLogin("Configuration")
  }
}

export function GET(req: Request, context: RouteContext) {
  return handleAuth(req, context)
}

export function POST(req: Request, context: RouteContext) {
  return handleAuth(req, context)
}
