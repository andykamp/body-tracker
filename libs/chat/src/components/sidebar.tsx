'use client'

import * as React from 'react'

import { clearChats } from '@/chat/actions'
import { Button, Text } from '@geist-ui/core'
import { Plus, Sidebar as IconSidebar } from '@geist-ui/icons'
import { Popover, Tooltip } from '@geist-ui/core'
import { ClearHistory } from '@/chat/components/clear-history'
import { SidebarFooter } from '@/chat/components/sidebar-footer'
import { useRouter } from 'next/navigation'
import { cn } from '@/chat/lib/utils'

export interface SidebarProps {
  children?: React.ReactNode
}

export function Sidebar({ children }: SidebarProps) {
  const router = useRouter()
  console.log('SIDEBAR', );

  const content = () => (
    <div className="w-[300px] flex-col p-2">
      <div className="flex flex-row justify-between items-center">
        <Text b>Chat History</Text>
        <div className="flex flex-row justify-end items-center">
          <SidebarFooter>
            <Tooltip text="Clear History" placement="top">
              <ClearHistory clearChats={clearChats} />
            </Tooltip>
          </SidebarFooter>
          <Tooltip text="New Chat" scale={0.5} >
            <Button
              scale={0.5}
              auto
              onClick={e => {
                e.preventDefault()
                router.refresh()
                router.push('/')
              }}
              className={cn(
                '!rounded-full bg-background'
              )}
              icon={<Plus />}
            />
          </Tooltip>
        </div>
      </div>

      <div className="h-80 overflow-y-scroll scrollbar-hide">
        {children}
      </div>
    </div>
  ) as any

  return (
    <Popover
      hideArrow
      placement='bottomStart'
      content={content()}
    >
      <Button
        scale={0.5}
        auto
        iconRight={<IconSidebar className="h-6 w-6" />}
      />
    </Popover >
  )
}
