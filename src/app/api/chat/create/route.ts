import prisma from "@/app/lib/prisma";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth/next"
import type { ChatCompletionRequestMessage } from 'openai';
import { NextResponse } from "next/server";
import cuid from 'cuid';

export async function POST(req: Request) {

    const session = await getServerSession(authOptions)
    if (!session) {
        return
    }

    const { mode } = await req.json()

    const ChatCompletionRequestMessageArray: ChatCompletionRequestMessage[] = [
        {
            role: "system",
            content: "我现在是一个全能机器人，可以回答任何问题！",
        }
    ];
    
    const strcuid =  cuid()
     const user = await prisma.user.upsert({
        where: {
            email: session.user.email as string
        },
        create: {
            chats: {
                create: { id: strcuid ,mode: mode, message: JSON.stringify(ChatCompletionRequestMessageArray), token: 0 },
            }
        },
        update: {
            chats: {
                create: { id: strcuid, mode: mode, message: JSON.stringify(ChatCompletionRequestMessageArray), token: 0 },
            }
        }
    });
    return NextResponse.json({ chatid:strcuid })
}
