import prisma from "@/app/lib/prisma";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server";

export async function GET() {

    const session = await getServerSession(authOptions)
    if (!session) {
        return
    }

    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email as string
        }
    });
    if (!user) {
        return
    }
    const latest = await prisma.chat.findFirst({
        where: {
            userId: user.id,
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    return NextResponse.json({chatid:latest?.id ,message : latest?.message})
}
