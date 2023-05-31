'use client'
import Chat, { ChatProps } from "./Chat";
import type { ChatCompletionRequestMessage } from 'openai';

export interface ChatData {
  avatar: string;
  messageData: ChatCompletionRequestMessage
}

interface ChatsProps {
  chats: ChatData[];
}

export const Chats: React.FC<ChatsProps> = ({ chats }) => {
  return (
    <div>
      {Array.from(chats.entries()).map(([sender, data]) => (
        <Chat avatar={data.avatar} messageData={data.messageData} />
      ))}
    </div>
  );
};