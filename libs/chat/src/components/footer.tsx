import React from 'react'

import { cn } from '@/chat/lib/utils'
import { Link } from '@geist-ui/core'

export function FooterText({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'px-2 text-center text-xs leading-normal text-muted-foreground',
        className
      )}
      {...props}
    >
      Open source AI chatbot built with{' '}
      <Link color href="https://nextjs.org">Next.js</Link> and{' '}
      <Link color href="https://vercel.com/storage/kv">
        Vercel KV
      </Link>
      .
    </p>
  )
}
