import { PrismaAdapter } from "@next-auth/prisma-adapter"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { z } from "zod"

import { verifyAdminLogin } from "@/lib/admin/bootstrap-admin-user"
import { prisma } from "@/lib/prisma"

const DAY_SECONDS = 60 * 60 * 24

const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
})

function resolveAuthSecret(): string {
  const fromEnv = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET
  if (fromEnv?.trim()) return fromEnv.trim()
  if (process.env.NODE_ENV === "development") {
    return "leseb-local-dev-nextauth-secret-set-NEXTAUTH_SECRET-in-env"
  }
  throw new Error(
    "Missing NEXTAUTH_SECRET (or AUTH_SECRET). Add it to .env — see .env.example.",
  )
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: resolveAuthSecret(),
  pages: {
    signIn: "/adminopia/login",
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
