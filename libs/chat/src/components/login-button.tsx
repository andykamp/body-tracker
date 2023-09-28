'use client'

import * as React from 'react'
// import { signIn } from 'next-auth/react'

import { cn } from '@/chat/lib/utils'
import { Button, type ButtonProps } from '@/chat/components/ui/button'
import { IconGitHub, IconSpinner } from '@/chat/components/ui/icons'

interface LoginButtonProps extends ButtonProps {
  signIn: (provider: string, options: object) => void
  showGithubIcon?: boolean
  text?: string
}

export function LoginButton(props: LoginButtonProps) {
  const {
    signIn,
    text = 'Login with GitHub',
    showGithubIcon = true,
    className,
    ...divProps
  } = props
  const [isLoading, setIsLoading] = React.useState(false)
  return (
    <Button
      variant="outline"
      onClick={() => {
        setIsLoading(true)
        // next-auth signIn() function doesn't work yet at Edge Runtime due to usage of BroadcastChannel
        signIn('github', { callbackUrl: `/` })
      }}
      disabled={isLoading}
      className={cn(className)}
      {...divProps}
    >
      {isLoading ? (
        <IconSpinner className="mr-2 animate-spin" />
      ) : showGithubIcon ? (
        <IconGitHub className="mr-2" />
      ) : null}
      {text}
    </Button>
  )
}
