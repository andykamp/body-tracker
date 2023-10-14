import { useAuthContext } from "@/auth-client/firebase/Provider";
import { notFound } from 'next/navigation'

import { getChat } from '@/chat/actions'
import { Chat } from '@/chat/components/chat'

import {
  useQuery,
} from '@tanstack/react-query'

type ChatPageProps = {
  id: string
}

export default function ChatPage(props: ChatPageProps) {
  const { id } = props
  const { user } = useAuthContext()
  console.log('ChatPage', id);


  const { data, isFetching } = useQuery({
    queryKey: ['getChat'],
    queryFn: () => getChat(id, user.uid)
  })

  const chat = data

  if(isFetching){
    return <div>loading...</div>
  }

  if (!chat) {
    notFound()
  }

  if (chat?.userId !== user.uid) {
    notFound()
  }

  return <Chat id={chat.id} initialMessages={chat.messages} />
}

