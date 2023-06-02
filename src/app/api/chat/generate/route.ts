import { NextResponse } from "next/server";
import openai from "@/app/lib/openai";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.redirect("/api/auth/signin")
  }
  const { prompt,chatid } = await req.json();

  const User = await prisma.chat.findFirst({
    where: {
      id: chatid
    }
  });

  const ChatCompletionRequestMessageArray = JSON.parse(User?.message as string);

  ChatCompletionRequestMessageArray.push({
    role: "user",
    content: prompt,
  });

  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: ChatCompletionRequestMessageArray,
  });

  const newmsg = chatCompletion.data.choices[0].message;
  ChatCompletionRequestMessageArray.push({
    role: newmsg?.role,
    content: newmsg?.content,
  });

  await prisma.chat.update({
    where: {
      id: chatid
    },
    data: {
      message: JSON.stringify(ChatCompletionRequestMessageArray),
      token: chatCompletion.data.usage?.total_tokens
    }
  });

  return NextResponse.json(chatCompletion.data.choices[0].message);
}
