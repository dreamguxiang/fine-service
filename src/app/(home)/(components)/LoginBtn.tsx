'use client'
import { getSession,useSession, signOut } from "next-auth/react"
import { Navbar, Button, Link, Dropdown, Avatar, Text } from "@nextui-org/react";

export default function LoginBtn() {
  const { data: session } = useSession()

  const handleAction = (actionKey: string | number) => {
    if (typeof actionKey === "string" && actionKey === "logout") {
      signOut()
    }
  }

  if (session) {
    return (
      <>
        <Dropdown placement="bottom-right">
          <Navbar.Item>
            <Dropdown.Trigger>
              <Avatar
                bordered
                as="button"
                color="primary"
                size="md"
                src={session?.user?.image ?? undefined}
              />
            </Dropdown.Trigger>
          </Navbar.Item>
          <Dropdown.Menu
            aria-label="User menu actions"
            color="secondary"
            onAction={handleAction}
          >
            <Dropdown.Item key="profile" css={{ height: "$18" }}>
              <Text b color="inherit" css={{ d: "flex" }}>
                账号
              </Text>
              <Text b color="inherit" css={{ d: "flex" }}>
                {session?.user?.email}
              </Text>
            </Dropdown.Item>
            <Dropdown.Item key="settings" withDivider>
              我的信息
            </Dropdown.Item>
            <Dropdown.Item key="analytics" >
              猫粮
            </Dropdown.Item>

            <Dropdown.Item key="logout" withDivider color="error">
               登出
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </>
    )
  }
  return (
    <Navbar.Item>
      <Button auto flat as={Link} href="login">
        登录
      </Button>
    </Navbar.Item>
  )
}