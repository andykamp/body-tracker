'use client'
import './globals.css'
import { AuthContextProvider } from '@/auth-client/firebase/AuthContext'
import { Analytics } from '@vercel/analytics/react'

type RootLayoutProps = {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
        <Analytics/>
      </body>
    </html>
  )
}

