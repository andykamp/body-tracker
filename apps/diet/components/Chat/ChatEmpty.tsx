import { nanoid } from '@/chat/lib/utils'
import { Chat } from '@/chat/components/chat'

// export const runtime = 'edge'

export default function ChatEmpty() {
  const id = nanoid() // random id that does not exist, so that the chat will be empty without the not found page


  return <Chat id={id} />
}

