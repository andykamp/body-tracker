'use client'

import { useChat } from 'ai/react'
import type { Message } from '@/chat/lib/types'
import { useAuthContext } from "@/auth-client/firebase/Provider";


import { cn } from '@/chat/lib/utils'
import { ChatList } from '@/chat/components/chat-list'
import { ChatPanel } from '@/chat/components/chat-panel'
import { EmptyScreen } from '@/chat/components/empty-screen'
import { ChatScrollAnchor } from '@/chat/components/chat-scroll-anchor'
import { toast } from 'react-hot-toast'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const { user } = useAuthContext()
  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      api: '/api/chat',
      initialMessages,
      id,
      body: {
        id,
        userId: user.uid
      },
      onResponse(response) {
      console.log('resonse',response );
      // if this is the first messge, make sure this is added to the history
        if (response.status === 401) {
          toast.error(response.statusText)
        }
      }
    })
  return (
    <>
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <EmptyScreen setInput={setInput} />
        )}
      </div>
      <ChatPanel
        id={id}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
      />
    </>
  )
}
