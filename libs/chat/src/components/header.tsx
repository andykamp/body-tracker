import * as React from 'react'
import Link from 'next/link'

import { auth } from '@/chat/auth'
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

export async function Header() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">

      <div className="flex items-center">
        {session?.user ? (
          <Sidebar>
            <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
              {/* @ts-ignore */}
              <SidebarList userId={session?.user?.id} />
            </React.Suspense>
          </Sidebar>
        ) : (
          <Link href="/" target="_blank" rel="nofollow">
            <IconNextChat className="w-6 h-6 mr-2 dark:hidden" inverted />
            <IconNextChat className="hidden w-6 h-6 mr-2 dark:block" />
          </Link>
        )}
      </div>

      <div className="flex items-center justify-end space-x-2">
        <div className="flex items-center">
          <IconSeparator className="w-6 h-6 text-muted-foreground/50" />
          {session?.user ? (
            <UserMenu
              user={session.user}
              signOut={signOut}
            />
          ) : (
            <Button variant="link" asChild className="-ml-2">
              <Link href="/sign-in?callbackUrl=/">Login</Link>
            </Button>
          )}
        </div>
      </div>

    </header>
  )
}
