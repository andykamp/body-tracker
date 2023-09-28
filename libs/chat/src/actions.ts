'use server'

import { redirect } from 'next/navigation'
import { nanoid } from '@/chat/lib/utils'

import { auth } from '@/chat/auth'
import type { Chat, Message } from '@/chat/lib/types'
import { adapter } from '@/chat/lib/chat/adapter'

type SetChatInput = {
  userId: string,
  title: string,
  id: string,
  completion: string,
  messages: Message[]
}

export async function setChat(input: SetChatInput) {
  const { userId, title, id, completion, messages } = input
  const createdAt = Date.now()
  const path = `/chat/${id}`
  const payload: Chat = {
    id,
    title,
    userId,
    createdAt,
    path,
    messages: [
      ...messages,
      {
        id: nanoid(),
        content: completion,
        role: 'assistant'
      }
    ]
  }

  console.log('SetChat',);
  await adapter.setChat({
    chatId: id,
    userId,
    payload,
    createdAt
  })
}

export async function getChats(userId?: string | null) {
  if (!userId) {
    return []
  }

  try {
    const results = await adapter.getChats(userId)

    console.log('GET_CHATS', results);

    return results as Chat[]
  } catch (error) {
    return []
  }
}

export async function getChat(id: string, userId: string) {
  const chat = await adapter.getChat(id)
  console.log('GET_CHAT');

  if (!chat || (userId && chat.userId !== userId)) {
    return null
  }

  return chat
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  const session = await auth()
  console.log('removeChat',);

  if (!session) {
    return {
      error: 'Unauthorized'
    }
  }

  await adapter.removeChat(id, session)

  // refrash path
  // revalidatePath('/')
  // return revalidatePath(path)
}

export async function clearChats() {
  const session = await auth()
  console.log('clearChats',);

  if (!session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }
  const userId = session.user.id
  await adapter.clearChats(userId, ()=>redirect('/'))

  // revalidatePath('/')
  return redirect('/')
}

export async function getSharedChat(id: string) {
  const chat = await adapter.getSharedChat(id)

  if (!chat || !chat.sharePath) {
    return null
  }

  return chat
}

export async function shareChat(chat: Chat) {
  const session = await auth()

  if (!session?.user?.id || session.user.id !== chat.userId) {
    return {
      error: 'Unauthorized'
    }
  }

  const payload = {
    ...chat,
    sharePath: `/share/${chat.id}`
  }

  await adapter.shareChat(chat.id, payload)

  return payload
}

