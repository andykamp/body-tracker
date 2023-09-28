import Link from 'next/link'
import { Button } from '@/chat/components/ui/button'
import {
  IconSeparator,
} from '@/chat/components/ui/icons'
import { UserMenu } from '@/chat/components/user-menu'

function signOut(){
  console.log('Singing out from profile...', );
}

type ProfileProps = {
  session: any
}
export function Profile(input: ProfileProps) {
  const { session } = input
  return (
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
  )

}
