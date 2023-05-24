'use client'
import { Card, Text, Grid, Textarea, Button, Spacer, Loading } from "@nextui-org/react";
import { Chats, ChatData } from "./(components)/Chats"
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

import "./chat.css"

export default function Sidebar() {
    const { data: session, status } = useSession()
    const [LoginNum, setLoginNum] = useState(3);

    const chats = new Map<string, ChatData>();
    const router = useRouter();
    chats.set('https://example.com/avatar1.png', { avatar: 'https://example.com/avatar1.png', message: '你好啊', isUser: false });
    chats.set('https://example.com/avatar2.png', { avatar: 'https://example.com/avatar1.png', message: '最近怎么样？', isUser: true });
    chats.set('https://example.com/avatar3.png', { avatar: 'https://example.com/avatar1.png', message: '很好，谢谢。你呢？', isUser: false });
    chats.set('https://example.com/avatar2.png', { avatar: 'https://example.com/avatar1.png', message: '我也很好，谢谢。', isUser: true });

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

    return (
        <>
            {session ? (
                <Grid.Container gap={3.5}>
                    <Grid xs direction={"column"}>
                        <Card variant="shadow" css={{ mw: `280px` }} >
                            <Card.Header>
                                <div id="cat">🐱</div>
                            </Card.Header>
                            <Card.Body>
                                <Text
                                    h5
                                    className="dynamics"
                                    weight="bold"
                                >
                                    猫 粮 ：
                                </Text>
                            </Card.Body>
                        </Card>
                        <Spacer y={1} />
                        <Card variant="shadow" css={{ mw: `280px`, minHeight: `70vh` }}>
                            <Card.Body>
                            </Card.Body>
                        </Card>
                    </Grid>
                    <Grid xs={9.5}>
                        <Card >
                            <Card.Body>
                                <Chats chats={chats}></Chats>
                            </Card.Body>
                            <Card.Divider />
                            <Card.Footer>
                                <Grid.Container>
                                    <Grid xs={10}>
                                        <Textarea aria-label="search" fullWidth size={"lg"} placeholder="请输入" rows={3} />
                                    </Grid>
                                    <Spacer y={1} />
                                    <Grid xs={1} alignItems={"center"}>
                                        <Button color="gradient" auto>
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