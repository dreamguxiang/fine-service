'use client'

import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import React from "react";

import type { ChatCompletionRequestMessage } from 'openai';
import { Button, Modal, Text, Card, Grid, Radio, Spacer, Textarea, Loading } from "@nextui-org/react";
import Chat, { Bubble, useMessages } from '@chatui/core';
import ChatGPTLogo from './ChatGPTLogo'

import '@chatui/core/dist/index.css';
import "./chat.css"

import ReactMarkdown from 'react-markdown';
import 'github-markdown-css/github-markdown.css'
import hljs from 'highlight.js';
import 'highlight.js/styles/default.css';

export default function Sidebar() {
    const { data: session, status } = useSession()
    const [LoginNum, setLoginNum] = useState(3);

    const router = useRouter();

    const [visible, setVisible] = useState(false);
    const handler = () => setVisible(true);
    const closeHandler = () => {
        setVisible(false);
    };

    const [checked, setChecked] = useState('gpt-3.5');
    const [chatId, setChatId] = useState('NULL');

    const { messages, appendMsg, deleteMsg, setTyping, resetList } = useMessages();

    React.useEffect(()=>{
        document.querySelectorAll("pre code").forEach((block: HTMLElement) => {
            try {
                hljs.highlightBlock(block);
            } catch (e) {
                console.log(e);
            }
        });
    });

    useEffect(() => {
        if (status === "unauthenticated" && !session) {
            setTimeout(() => {
                setLoginNum(2)
            }, 1000);
            setTimeout(() => {
                setLoginNum(1)
            }, 2000);
            const timer = setTimeout(() => {
                router.push("/login");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [status, session, router]);

    let isfirstPost = true;
    useEffect(() => {
        const fetchLanguageData = async () => {
            const res = await fetch("/api/chat/getlatest", {
                method: "GET"
            });
            if (res.ok) {
                resetList();
                const { message, chatid } = await res.json();
                if (!message) {
                    return;
                }
                const msgs = JSON.parse(message) as ChatCompletionRequestMessage[];
                for (let data of msgs) {
                    appendMsg({
                        type: 'text',
                        content: { text: data.content },
                        position: data.role === "user" ? 'right' : 'left',
                        user: { avatar: data.role === "user" ? "" : ChatGPTLogo() },
                    });
                }
                setChatId(chatid);
            }
        }
        if (isfirstPost) {
            fetchLanguageData();
            isfirstPost = false;
        }
    }, [isfirstPost]);

    const handleClickCreate = async () => {
        setVisible(false);
        const res = await fetch("/api/chat/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                mode: checked,
            }),
        });

        if (res.ok) {
            const { chatid } = await res.json();
            setChatId(chatid);
            resetList();
        }

    };


    ////

    async function handleSend(type : string, val: string) {
        if (type === 'text' && val.trim()) {
            appendMsg({
                type: 'text',
                content: { text: val },
                position: 'right',
            });
            setTyping(true);
            const res = await fetch("/api/chat/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: val,
                    chatid: chatId,
                }),
            });

            if (res.ok) {
                const result = await res.json();
                appendMsg({
                    type: 'text',
                    content: { text: result.content },
                    position: result.role === "user" ? 'right' : 'left',
                    user: { avatar: result.role === "user" ? "ChatGPTLogo()" : ChatGPTLogo() },
                });
            }
        }
    }

    function renderMessageContent(msg : any) {
        const { type, content } = msg;

        switch (type) {
            case 'text':
                return (
                    <Bubble type="text">
                           <ReactMarkdown>{content.text}</ReactMarkdown>
                    </Bubble>
                );
            case 'image':
                return (
                    <Bubble type="image">
                        <img src={content.picUrl} alt="" />
                    </Bubble>
                );
            default:
                return null;
        }
    }

    return (
        <>
            <Modal
                closeButton
                blur
                aria-labelledby="modal-title"
                open={visible}
                onClose={closeHandler}
            >
                <Modal.Header>
                    <Text h4 id="modal-title">
                        新建会话
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <Radio.Group orientation="horizontal" label="请选择你使用的模型" value={checked} onChange={setChecked}>
                        <Radio size="xs" color="success" value="gpt-3.5">GPT-3.5</Radio>
                        <Radio size="xs" color="success" value="gpt-4">GPT-4</Radio>
                    </Radio.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button auto onPress={handleClickCreate}>创建</Button>
                </Modal.Footer>
            </Modal>
            {session ? (
                <Grid.Container gap={3.5}>
                    <Grid>
                        <Card variant="shadow" css={{ mw: `220px` }} >
                            <Card.Body>
                                <Text
                                    h5
                                    className="dynamics"
                                    weight="bold"
                                >
                                    当前会话：{chatId}
                                </Text>
                            </Card.Body>
                        </Card>
                        <Spacer y={1} />
                        <Card variant="shadow" css={{ mw: `220px`, height: `70vh` }}>
                            <Card.Header>
                                <Grid.Container justify="center">
                                    <Grid>
                                        <Button color="gradient" onPress={handler}>
                                            <Text color="gradient">新 建 会 话</Text>
                                        </Button>
                                    </Grid>
                                </Grid.Container>
                            </Card.Header>
                            <Card.Body>

                                <Text h4 color="secondary">ADSSSSSSSSSSSSSSSSS</Text>
                                <Text h4 color="secondary">ADSSSSSSSSSSSSSSSSS</Text>
                                <Text h4 color="secondary">ADSSSSSSSSSSSSSSSSS</Text>

                            </Card.Body>
                        </Card>
                    </Grid>

                    <Grid xs>
                        <Card css={{ height: `80vh` }}>
                            <Card.Body>
                                <Chat
                                    navbar={{ title: '当前会话：' + chatId }}
                                    messages={messages}
                                    renderMessageContent={renderMessageContent}
                                    onSend={handleSend}
                                />
                            </Card.Body>
                        </Card>
                    </Grid>
                </Grid.Container>

            ) : (
                <>
                    {status && status === "loading" ? (
                        <Grid.Container alignItems="center" justify="center" style={{ height: "60vh" }}>
                            <Loading size={"lg"} color="secondary" textColor="secondary">
                                加载中...
                            </Loading>
                        </Grid.Container>
                    ) : (
                        <Grid.Container alignItems="center" justify="center" style={{ height: "60vh" }}>
                            <Text h3 color="secondary">请先登录！{LoginNum}秒后转跳登录页面！</Text>
                        </Grid.Container>
                    )}
                </>
            )}
        </>
    )
}