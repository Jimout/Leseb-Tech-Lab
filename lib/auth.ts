import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { z } from "zod"

import { ADMIN_LOGIN_PATH } from "@/lib/admin/admin-routes"
import { verifyAdminLogin } from "@/lib/admin/bootstrap-admin-user"

const DAY_SECONDS = 60 * 60 * 24

const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
})

/** Used only while `next build` collects page data (e.g. Vercel before env is injected). */
const AUTH_SECRET_BUILD_PLACEHOLDER =
  "leseb-build-phase-placeholder-set-NEXTAUTH_SECRET-in-vercel"

function isNextProductionBuild(): boolean {
  return process.env.NEXT_PHASE === "phase-production-build"
}

function resolveAuthSecret(): string {
  const fromEnv = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET
  if (fromEnv?.trim()) return fromEnv.trim()
  if (process.env.NODE_ENV === "development") {
    return "leseb-local-dev-nextauth-secret-set-NEXTAUTH_SECRET-in-env"
  }
  if (isNextProductionBuild()) {
    return AUTH_SECRET_BUILD_PLACEHOLDER
  }
  throw new Error(
    "Missing NEXTAUTH_SECRET (or AUTH_SECRET). Add it to .env — see .env.example.",
  )
}

export const authOptions: NextAuthOptions = {
  // JWT + credentials only — PrismaAdapter conflicts with credentials and can 500 on Vercel.
  secret: resolveAuthSecret(),
  trustHost: true,
  pages: {
    signIn: ADMIN_LOGIN_PATH,
    error: ADMIN_LOGIN_PATH,
  },
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
