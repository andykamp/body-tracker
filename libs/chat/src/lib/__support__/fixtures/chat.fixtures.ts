import type { Chat } from '@/chat/lib/types'

export const Chats: Chat[] = [
  {
    id: 'chat1',
    title: 'Chat 1',
    createdAt: Date.now(),
    userId: 'user1',
    path: '/path/to/chat1',
    messages: [
      {
        role: 'assistant',
        content: 'Hello from assistant in Chat 1!',
        id: 'msg1'
      },
      {
        role: 'user',
        content: 'Hello from user in Chat 1!',
        id: 'msg2'
      }
    ],
    sharePath: '/share/chat1'
  },
  {
    id: 'chat2',
    title: 'Chat 2',
    createdAt: Date.now(),
    userId: 'user2',
    path: '/path/to/chat2',
    messages: [
      {
        role: 'assistant',
        content: 'Hello from assistant in Chat 2!',
        id: 'msg3'
      }
    ],
    sharePath: '/share/chat2'
  },
  {
    id: 'chat3',
    title: 'Chat 3',
    createdAt: Date.now(),
    userId: 'user3',
    path: '/path/to/chat3',
    messages: [
      {
        role: 'user',
        content: 'Hello from user in Chat 3!',
        id: 'msg4'
      },
      {
        role: 'assistant',
        content: 'How can I assist you in Chat 3?',
        id: 'msg5'
      }
    ]
  }
];

