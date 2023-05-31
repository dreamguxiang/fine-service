"use client"
import React from 'react';
import { Avatar } from "@nextui-org/react"
import ReactMarkdown from 'react-markdown';
import { ChatGPTLogo } from './ChatGPTLogo'
import type { ChatCompletionRequestMessage } from 'openai';;

export interface ChatProps {
    avatar: string;
    messageData: ChatCompletionRequestMessage;
}

const Chat: React.FC<ChatProps> = ({ avatar, messageData }) => {

    const chatStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
        justifyContent: messageData.role === "user" ? 'flex-end' : 'flex-start',
    };

    const avatarStyle = {
        minwidth: '64px',
        minheight: '64px',
        borderRadius: '50%',
        marginRight: messageData.role === "user" ? '0' : '10px',
        marginLeft: messageData.role === "user" ? '10px' : '0',
    };

    const messageStyle = {
        backgroundColor: messageData.role === "user" ? '#dcf8c6' : '#f0f0f0',
        padding: '10px',
        borderRadius: '10px',
    };

    return (
        <div style={chatStyle}>
            {!(messageData.role === "user") && <ChatGPTLogo style={avatarStyle} />}
            <div style={messageStyle}>
                <ReactMarkdown>{messageData.content}</ReactMarkdown>
            </div>
            {(messageData.role === "user") && <Avatar zoomed src={avatar} style={avatarStyle} />}
        </div>
    );
};

export default Chat;