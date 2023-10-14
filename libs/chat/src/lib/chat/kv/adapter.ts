import type { Chat } from '@/chat/lib/types'
import type * as t from '@/chat/lib/chat/types'
import { kv } from '@vercel/kv'

async function setChat(input: t.setChatInput) {
  const { chatId, userId, payload, createdAt } = input

  // set payload to the 'chat:chatId' key
  await kv.hmset(`chat:${chatId}`, payload)

  // keep track of a ordered list based on score
  await kv.zadd(`user:chat:${userId}`, {
    score: createdAt,
    member: `chat:${chatId}`
  })
}

async function getChats(userId: string) {
  const pipeline = kv.pipeline()
  const chats: string[] = await kv.zrange(`user:chat:${userId}`, 0, -1, {
    rev: true
  })

  for (const chat of chats) {
    pipeline.hgetall(chat)
  }

  const results: Chat[] = await pipeline.exec()
  return results
}

async function getChat(chatId: string) {
  const chat = await kv.hgetall<Chat>(`chat:${chatId}`)
  return chat
}

async function removeChat(chatId: string, session: any) {
  const uid = await kv.hget<string>(`chat:${chatId}`, 'userId')

  if (uid !== session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  await kv.del(`chat:${chatId}`)
  await kv.zrem(`user:chat:${session.user.id}`, `chat:${chatId}`)
}

async function clearChats(userId: string, redirect: () => void) {
  const chats: string[] = await kv.zrange(`user:chat:${userId}`, 0, -1)
  if (!chats.length) {
    return redirect()
  }
  const pipeline = kv.pipeline()

  for (const chat of chats) {
    pipeline.del(chat)
    pipeline.zrem(`user:chat:${userId}`, chat)
  }

  await pipeline.exec()
}

async function getSharedChat(chatId: string) {
  const chat = await kv.hgetall<Chat>(`chat:${chatId}`)
  return chat
}

async function shareChat(chatId: string, payload: Chat) {
  await kv.hmset(`chat:${chatId}`, payload)
}

const adapter = {
  setChat,
  getChats,
  getChat,
  removeChat,
  clearChats,
  getSharedChat,
  shareChat
}

export type Adapter = typeof adapter
export default adapter
