'use client'
import { NextUIProvider } from '@nextui-org/react'
import { SessionProvider } from "next-auth/react";
import { useSSR } from '@nextui-org/react'


export default function Providers({ children }: { children: React.ReactNode }) {
  const { isBrowser } = useSSR()

  if (!isBrowser) {
    return null;
  }

  return (
    <SessionProvider>
      <NextUIProvider>
        {children}
      </NextUIProvider>
    </SessionProvider>
  );
}