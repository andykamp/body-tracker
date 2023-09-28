'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { type Chat } from '@/chat/lib/types'
import { cn } from '@/chat/lib/utils'
import { IconMessage, IconUsers } from '@/chat/components/ui/icons'
import { Tooltip, Text } from '@geist-ui/core'
interface SidebarItemProps {
  chat: Chat
  children: React.ReactNode
}

export function SidebarItem({ chat, children }: SidebarItemProps) {
  const pathname = usePathname()
  const isActive = pathname === chat.path

  if (!chat?.id) return null

  return (
    <div className="relative">
      <div className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center">
        {chat.sharePath ? (
          <Tooltip
            scale={0.5}
            placement="topStart"
            enterDelay={1000}
            text={<>This is a shared chat.</>}
          >
            <IconUsers className="mr-2" />
          </Tooltip>
        ) : (
          <IconMessage className="mr-2" />
        )}
      </div>
      <Link
        href={chat.path}
        className={cn(
          'flex items-center justify-center text-foreground shadow transition-colors group py-2 pl-8 pr-16 hover:bg-accent hover:text-accent-foreground',
          isActive && 'bg-accent'
        )}
      >
        <div
          className="relative max-h-5 flex-1 select-none overflow-hidden text-ellipsis break-all"
          title={chat.title}
        >
          <Text span className="whitespace-nowrap">{chat.title}</Text>
        </div>
        <div className="absolute right-2 top-2 hidden group-hover:flex">{children}</div>
      </Link>
    </div>
  )
}
