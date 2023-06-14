'use client'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import ThemeProvider from '@/diet/components/ThemeProvider'
import QueryProvider from '@/diet/components/QueryProvider'

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
        <ThemeProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html >
  )
}

