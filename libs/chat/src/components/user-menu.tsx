'use client'

import Image from 'next/image'
import { type Session } from '@/user-client/types'

import { Button } from '@/chat/components/ui/button'
import { Popover } from '@geist-ui/core'

export interface UserMenuProps {
  user: Session['user']
  signOut: (options?: { callbackUrl: string }) => void
}

function getUserInitials(name: string) {
  const [firstName, lastName] = name.split(' ')
  return lastName ? `${firstName[0]}${lastName[0]}` : firstName.slice(0, 2)
}

export function UserMenu(props: UserMenuProps) {
  const { user, signOut } = props
  const content = () => (
    <div className="w-[180px]">
      <div className="flex-col items-start">
        <div className="text-xs font-medium">{user?.name}</div>
        <div className="text-xs text-zinc-500">{user?.email}</div>
      </div>
      <div
        onClick={() =>
          signOut({
            callbackUrl: '/'
          })
        }
        className="text-xs"
      >
        Log Out
      </div>
    </div>
  ) as any

  return (
    <div className="flex items-center justify-between">
      <Popover
        hideArrow
        placement="bottomEnd"
        content={content()}
      >
        <Button variant="ghost" className="pl-0">
          {user?.image ? (
            <Image
              className="w-6 h-6 transition-opacity duration-300 rounded-full select-none ring-1 ring-zinc-100/10 hover:opacity-80"
              src={user?.image ? `${user.image}&s=60` : ''}
              alt={user.name ?? 'Avatar'}
            />
          ) : (
            <div className="flex items-center justify-center text-xs font-medium uppercase rounded-full select-none h-7 w-7 shrink-0 bg-muted/50 text-muted-foreground">
              {user?.name ? getUserInitials(user?.name) : null}
            </div>
          )}
          <span className="ml-2">{user?.name}</span>
        </Button>
      </Popover>
    </div>
  )
}
