import {NextAuthOptions, type DefaultSession } from "next-auth"
import AzureADProvider from 'next-auth/providers/azure-ad'
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma";
import { xbl } from '@xboxreplay/xboxlive-auth';

declare module "next-auth" {
    interface Session {
      user: {
        name?: string | null
        username: string | null
        email: string | null
        image?: string | null
        xboxname: string | null
        xboxuid: string | null
      } & DefaultSession['user'];
    }
  }
  
  export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
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
    session: {
      strategy: "jwt",
    },
    jwt: {
      secret: "fine-!@#$%^&*()_+",
    },
    callbacks: {
      async jwt({ token, account, profile }) {
        if (account) {
          token.access_token = account.access_token
        }
        return token
      },
  
      async session({ session, token, user }) {
        if (token && token.access_token) {
          const userTokenResponse = await xbl.exchangeRpsTicketForUserToken(token.access_token as string, 'd');
          const XSTSTokenResponse = await xbl.exchangeTokenForXSTSToken(userTokenResponse.Token);
          const xuid = XSTSTokenResponse.DisplayClaims.xui[0].xid;
          const display = XSTSTokenResponse.DisplayClaims.xui[0].gtg;
          await prisma.user.upsert({
            where: { email: token.email as string },
            update: {
              xboxName: display,
              xboxUid: xuid
            },
            create: {
              xboxName: display,
              xboxUid: xuid
            }
          });
          session.user.xboxname = display;
          if (xuid) {
            session.user.xboxuid = xuid;
          }
        }
        return session
      }
    }
  }
  