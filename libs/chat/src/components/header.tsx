import * as React from 'react'
import Link from 'next/link'

import { User } from '@/user-client/types'
import { Button } from '@/chat/components/ui/button'
import { Sidebar } from '@/chat/components/sidebar'
import { SidebarList } from '@/chat/components/sidebar-list'
import {
  IconNextChat,
  IconSeparator,
} from '@/chat/components/ui/icons'
import { UserMenu } from '@/chat/components/user-menu'

function signOut(){
  console.log('Singing out from Header...', );
}

type HeaderProps = {
  user: User
}
export function Header(props: HeaderProps) {
  const {user} = props

  return (
      <div className="absolute left-0 flex items-center">
          <Sidebar userId={user.uid}>
            <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
              <SidebarList userId={user.uid} />
            </React.Suspense>
          </Sidebar>
      </div>

  )
}
