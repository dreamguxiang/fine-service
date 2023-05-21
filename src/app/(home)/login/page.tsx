'use client'
import { Card, Input, Spacer, Text, Button } from "@nextui-org/react";
import { useState } from "react";
import { signIn } from "next-auth/react";



export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>
      <Card css={{ mw: '400px' }} variant="bordered">
        <Card.Header>
          <Spacer x={1} y={1} />
          <Text
            h3
            size={40}
            style={{ textAlign: 'center' }}
            css={{ textGradient: '45deg, $blue600 -20%, $pink600 60%' }}
            weight="bold"
          >
            登 录
          </Text>
        </Card.Header>

        <Card.Body>
          <Input
            type="email"
            placeholder="邮箱"
            aria-label="search"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Spacer y={1} />
          <Input.Password
            type="password"
            placeholder="密码"
            aria-label="search"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Card.Body>

        <Card.Footer>
          <Button size="sm" shadow ghost color="gradient" onClick={(e) => signIn("azure-ad")}>
            微软登录
          </Button>
          <Spacer x={4} />
          <Button size="sm" shadow ghost color="gradient">
            登录
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
}