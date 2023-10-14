'use client'

import Chat from '@/diet/components/Chat/Chat';
import ChatEmpty from '@/diet/components/Chat/ChatEmpty';
import { useSearchParams } from 'next/navigation'
import { useAuthContext } from "@/auth-client/firebase/Provider";

import { Toaster } from 'react-hot-toast'

import { TailwindIndicator } from '@/chat/components/tailwind-indicator'
import { Header } from '@/chat/components/header'

export default function Page() {
  const searchParams = useSearchParams()
  const chatId = searchParams.get('chatId')
  const { user } = useAuthContext()
  console.log('chatId parameter',chatId );

  return (
    <div>
      <Toaster />
      <div className="flex flex-col min-h-screen">
        <Header user={user}/>
        <div className="flex flex-col flex-1 bg-muted/50">
          {chatId ?
            <Chat id={chatId} />
            :
            <ChatEmpty />
          }

        </div>
      </div>
      <TailwindIndicator />

    </div>
  )
}
