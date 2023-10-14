"use client";

import Chat from '@/diet/components/Chat/Chat';

export interface ChatPageProps {
  params: {
    id: string
  }
}

export default function ChatPage({ params }: ChatPageProps) {
  return <Chat id={params.id}/>
}
