'use client'

import Chat from '@/diet/components/Chat/Chat';
import ChatEmpty from '@/diet/components/Chat/ChatEmpty';
import { useSearchParams } from 'next/navigation'
import { useAuthContext } from "@/auth-client/firebase/Provider";

import { Toaster } from 'react-hot-toast'

import { TailwindIndicator } from '@/chat/components/tailwind-indicator'
import { Header } from '@/chat/components/header'

interface Layout {
  children: React.ReactNode
}


export default function Layout(props: Layout) {
  const { children } = props
  const searchParams = useSearchParams()
  const chatId = searchParams.get('chatId')
  const { user } = useAuthContext()
  console.log('chatId parameter',chatId );

  return (
    <div>
      <Toaster />
        <div className="relative flex flex-col flex-1 bg-muted/50">
        <Header user={user}/>
          {children}
        </div>
      <TailwindIndicator />

    </div>
  )
}
