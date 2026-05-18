import NextAuth from "next-auth"

import { assertProductionAuthSecret, authOptions } from "@/lib/auth"

const nextAuthHandler = NextAuth(authOptions)

async function handler(
  req: Parameters<typeof nextAuthHandler>[0],
  context: Parameters<typeof nextAuthHandler>[1],
) {
  assertProductionAuthSecret()
  return nextAuthHandler(req, context)
}

export { handler as GET, handler as POST }
