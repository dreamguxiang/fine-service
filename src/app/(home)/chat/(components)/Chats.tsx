'use client'
import Chat,{ChatProps} from "./Chat";

export interface ChatData {
    avatar: string;
    message: string;
    isUser: boolean;
}

interface ChatsProps {
    chats: Map<string, ChatData>;
}
  
export const Chats: React.FC<ChatsProps> = ({ chats }) => {
    return (
      <div>
        {Array.from(chats.entries()).map(([sender, data]) => (
          <Chat avatar={data.avatar} message={data.message} isUser={data.isUser} />
        ))}
      </div>
    );
  };