'use client'
import './globals.css'
import { AuthContextProvider } from '@/auth-client/firebase/AuthContext'
import { Analytics } from '@vercel/analytics/react'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { UserContextProvider } from "@/user-client/Provider";
import ThemeProvider from '@/diet/components/ThemeProvider'
import { WithingsContextProvider } from '@/withings-client/Provider'

// Create a client
const queryClient = new QueryClient()

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
          <AuthContextProvider>
            <QueryClientProvider client={queryClient}>
              <UserContextProvider>
                <WithingsContextProvider>
                  {children}
                </WithingsContextProvider>
              </UserContextProvider>
            </QueryClientProvider>
          </AuthContextProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

