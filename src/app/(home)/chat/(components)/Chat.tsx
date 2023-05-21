"use client"
import React from 'react';
import { Avatar } from "@nextui-org/react"
import ReactMarkdown from 'react-markdown';
import { ChatGPTLogo } from './ChatGPTLogo';

export interface ChatProps {
    avatar: string;
    message: string;
    isUser?: boolean;
}

const Chat: React.FC<ChatProps> = ({ avatar, message, isUser = false }) => {
    const chatStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
    };

    const avatarStyle = {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        marginRight: isUser ? '0' : '10px',
        marginLeft: isUser ? '10px' : '0',
    };

    const messageStyle = {
        backgroundColor: isUser ? '#dcf8c6' : '#f0f0f0',
        padding: '10px',
        borderRadius: '10px',
    };


    return (
        <div style={chatStyle}>
            {!isUser && <ChatGPTLogo  style={avatarStyle}/>}
            <div style={messageStyle}>
                <ReactMarkdown>{message}</ReactMarkdown>
            </div>
            {isUser && <Avatar zoomed src={avatar} style={avatarStyle} />}
        </div>
    );
};

export default Chat;