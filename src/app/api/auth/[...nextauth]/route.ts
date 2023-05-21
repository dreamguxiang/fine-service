import NextAuth from "next-auth"
import AzureADProvider from 'next-auth/providers/azure-ad'
//import { xbl, authenticate, live } from '@xboxreplay/xboxlive-auth';
const handler = NextAuth({
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID as string,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET as string,
      tenantId: "consumers",
      authorization: {
        params: {
          scope:
            "XboxLive.signin XboxLive.offline_access openid profile email",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token = Object.assign({}, token, { access_token: account.access_token });

      }
      return token
    },
    async session({ session, token }) {
      if (session) {
        session = Object.assign({}, session, { access_token: token.access_token })
      }
      return session
    }

  }
})

export { handler as GET, handler as POST }