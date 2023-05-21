'use client'
import { Card, Text, Grid, Textarea, Button, Spacer, Container, Row } from "@nextui-org/react";
import "./chat.css"
import {Chats,ChatData} from "./(components)/Chats"

export default function Sidebar() {
    const chats = new Map<string, ChatData>();
    chats.set('https://example.com/avatar1.png', {avatar:'https://example.com/avatar1.png' ,message: '你好啊', isUser: false });
    chats.set('https://example.com/avatar2.png', {avatar:'https://example.com/avatar1.png', message: '最近怎么样？', isUser: true });
    chats.set('https://example.com/avatar3.png', { avatar:'https://example.com/avatar1.png',message: '很好，谢谢。你呢？', isUser: false });
    chats.set('https://example.com/avatar2.png', {avatar:'https://example.com/avatar1.png', message: '我也很好，谢谢。', isUser: true });

    return (
        <>
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

        </>
    )
}