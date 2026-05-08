import { PrismaAdapter } from "@next-auth/prisma-adapter"
import bcrypt from "bcrypt"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

const DAY_SECONDS = 60 * 60 * 24

const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
})

const authSecret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET
const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: authSecret,
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

        const email = parsed.data.email.toLowerCase()
        if (adminEmail && email !== adminEmail) return null
        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user?.password) return null

        const valid = await bcrypt.compare(parsed.data.password, user.password)
        if (!valid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
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
