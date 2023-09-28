import type { Chat } from '@/chat/lib/types'

export type setChatInput = {
  chatId: string,
  userId: string,
  payload: Chat,
  createdAt: number
}

