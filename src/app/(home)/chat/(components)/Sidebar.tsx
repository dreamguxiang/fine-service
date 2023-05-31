'use client'
import { Card, Text, Grid, Textarea, Button, Spacer, Loading, Modal, Radio } from "@nextui-org/react";
import { Chats, ChatData } from "./Chats"
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation';
import { useRef, useEffect, useState } from "react";
import React from "react";
import "./chat.css"
import type { ChatCompletionRequestMessage } from 'openai';


export default function Sidebar() {
    const { data: session, status } = useSession()
    const [LoginNum, setLoginNum] = useState(3);

    const router = useRouter();

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [visible, setVisible] = useState(false);
    const handler = () => setVisible(true);
    const closeHandler = () => {
        setVisible(false);
    };

    const [checked, setChecked] = useState('gpt-3.5');
    const [chatId, setChatId] = useState('NULL');

    const [message, setMessage] = useState<ChatData[]>();

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
            console.log(res);
            if (res.ok) {
                const { message, chatid } = await res.json();
                const msgs = JSON.parse(message) as ChatCompletionRequestMessage[];
                const result: ChatData[] = [];
                for (let data of msgs) {
                    console.log(data);
                    result.push({
                        avatar: "",
                        messageData: data
                    });
                }
                setMessage(result);
                setChatId(chatid);
            }
        }
        if (isfirstPost) {
            fetchLanguageData();
            isfirstPost = false;
        }
    }, [isfirstPost]);

    
    const handleClickSend = async () => {
        if (!textareaRef?.current?.value) {
            return
        }
        let inputstr = "";
        if (textareaRef.current) {
            inputstr = textareaRef.current.value as string;
            textareaRef.current.value = "";
        }

        const message2 = [...(message ?? [])];

        message2?.push({
            avatar: "",
            messageData: {
                content: inputstr,
                role: "user",
            }
        }, {
            avatar: "",
            messageData: {
                content: "正在思考中...",
                role: "assistant",
            },
        })

        setMessage(message2);

        const res = await fetch("/api/chat/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: inputstr,
                chatid: chatId,
            }),
        });
        if (res.ok) {
            const msg = await res.json();
            const msgs = JSON.parse(msg) as ChatCompletionRequestMessage[];
            const result: ChatData[] = [];
            msgs.map((msg) => {
                result.push({
                    avatar: "",
                    messageData: msg
                }
                );
            })
            setMessage(result);
        }
    };

    const handleClickCreate = async () => {
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
        }
        setVisible(false);

    };

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
                    <Grid xs direction={"column"}>
                        <Card variant="shadow" css={{ mw: `280px` }} >
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
                        <Card variant="shadow" css={{ mw: `280px`, minHeight: `70vh` }}>
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

                            </Card.Body>
                        </Card>
                    </Grid>
                    <Grid xs={9.5}>
                        <Card >
                            <Card.Body>
                                {message && message.length > 0 ? (
                                    <Chats chats={message as ChatData[]}></Chats>
                                ) : (
                                    <Text h3 color="secondary">暂时没有任何对话</Text>
                                )}

                            </Card.Body>
                            <Card.Divider />
                            <Card.Footer>
                                <Grid.Container>
                                    <Grid xs={10}>
                                        <Textarea ref={textareaRef} aria-label="search" fullWidth size={"lg"} placeholder="请输入" rows={3} />
                                    </Grid>
                                    <Spacer y={1} />
                                    <Grid xs={1} alignItems={"center"}>
                                        <Button color="gradient" auto onClick={handleClickSend}>
                                            提交
                                        </Button>
                                    </Grid>
                                </Grid.Container>
                            </Card.Footer>
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