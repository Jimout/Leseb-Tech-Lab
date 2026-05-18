import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { z } from "zod"

import { ADMIN_LOGIN_PATH } from "@/lib/admin/admin-routes"
import { verifyAdminLogin } from "@/lib/admin/bootstrap-admin-user"
import { ensureNextAuthRuntimeEnv } from "@/lib/auth-env"
import { getSiteUrl } from "@/lib/seo/site-config"

const DAY_SECONDS = 60 * 60 * 24

const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
})

/** Used when NEXTAUTH_SECRET is missing during build or at runtime (handler redirects). */
const AUTH_SECRET_BUILD_PLACEHOLDER =
  "leseb-build-phase-placeholder-set-NEXTAUTH_SECRET-in-vercel"

function resolveAuthSecret(): string {
  const fromEnv = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET
  if (fromEnv?.trim()) return fromEnv.trim()
  if (process.env.NODE_ENV === "development") {
    return "leseb-local-dev-nextauth-secret-set-NEXTAUTH_SECRET-in-env"
  }
  return AUTH_SECRET_BUILD_PLACEHOLDER
}

function authPages(): NonNullable<NextAuthOptions["pages"]> {
  ensureNextAuthRuntimeEnv()
  const base = getSiteUrl().replace(/\/$/, "")
  const login = `${base}${ADMIN_LOGIN_PATH}`
  return { signIn: login, error: login }
}

export function buildAuthOptions(): NextAuthOptions {
  return {
    secret: resolveAuthSecret(),
    trustHost: true,
    pages: authPages(),
    session: {
      strategy: "jwt",
      maxAge: 7 * DAY_SECONDS,
    },
    jwt: {
      maxAge: DAY_SECONDS,
    },
    providers: [
      CredentialsProvider({
        name: "credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          const parsed = credentialsSchema.safeParse(credentials)
          if (!parsed.success) return null

          try {
            const user = await verifyAdminLogin(
              parsed.data.email,
              parsed.data.password,
            )
            if (!user) return null

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: null,
            }
          } catch (error) {
            console.error("[auth] authorize failed:", error)
            return null
          }
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.sub = user.id
          token.email = user.email
          token.name = user.name
          token.picture = user.image ?? undefined
        }
        return token
      },
      async session({ session, token }) {
        if (session.user) {
          const id = token.sub
          if (id) session.user.id = id
          session.user.email = token.email
          session.user.name = token.name
          session.user.image = token.picture
        }
        return session
      },
    },
  }
}

export const authOptions: NextAuthOptions = buildAuthOptions()
