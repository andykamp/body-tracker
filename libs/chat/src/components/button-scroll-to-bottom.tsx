'use client'

import * as React from 'react'

import { cn } from '@/chat/lib/utils'
import { useAtBottom } from '@/chat/lib/hooks/use-at-bottom'
import {Button, ButtonProps} from '@geist-ui/core'
import { ArrowDown } from '@geist-ui/icons'

export function ButtonScrollToBottom({ className, ...props }: ButtonProps) {
  const isAtBottom = useAtBottom()

  return (
    <Button
      scale={0.5}
      auto
      className={cn(
        '!absolute right-4 top-1 z-10 bg-background transition-opacity duration-300 sm:right-8 md:top-2',
        isAtBottom ? 'opacity-0' : 'opacity-100',
        className
      )}
      icon={<ArrowDown />}
      onClick={() =>
        window.scrollTo({
          top: document.body.offsetHeight,
          behavior: 'smooth'
        })
      }
      {...props}
    />
  )
}
