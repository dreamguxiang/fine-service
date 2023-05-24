'use client'
import { useSession, signOut } from "next-auth/react"
import { Navbar, Button, Link, Dropdown, Avatar, Text, Loading, Modal } from "@nextui-org/react";
import { useState } from "react";

export default function LoginBtn() {
  const { data: session, status } = useSession()
  const [showConfirm, setShowConfirm] = useState(false);

  const handleAction = (actionKey: string | number) => {
    if (typeof actionKey === "string" && actionKey === "logout") {
      setShowConfirm(true);
    }
  }

  const handleConfirmOk = () => {
    signOut();
  };

  const handleConfirmCancel = () => {
    setShowConfirm(false);
  };

  return (
    <>
      {session ? (
        <>
          <Text b>
            {session?.user?.xboxname}
          </Text>
          <Dropdown placement="bottom-right">
            <Navbar.Item>
              <Dropdown.Trigger>
                <Avatar
                  bordered
                  as="button"
                  color="primary"
                  size="md"
                  src={session?.user?.email ?? undefined}
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
          <Modal
            closeButton
            animated={false}
            aria-labelledby="modal-title"
            open={showConfirm}
            onClose={handleConfirmCancel}
          >
            <Modal.Body>
              <Text>确定要注销吗？</Text>
            </Modal.Body>
            <Modal.Footer>
              <Button auto onClick={handleConfirmCancel}>
                取消
              </Button>
              <Button auto color="error" onClick={handleConfirmOk}>
                确定
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <Navbar.Item>
          <Button auto flat as={Link} href="login">
            {status && status === "loading" ? (
              <Loading type="points" color="currentColor" size="sm" />
            ) : (
              "登录"
            )}
          </Button>
        </Navbar.Item>
      )}
    </>
  )
}