'use client'

import { useToasts } from '@geist-ui/core'
import * as React from 'react'

export interface useCopyToClipboardProps {
  timeout?: number
}

export function useCopyToClipboard({
  timeout = 2000
}: useCopyToClipboardProps) {
  const [isCopied, setIsCopied] = React.useState<Boolean>(false)
  const { setToast } = useToasts()


  const copyToClipboard = (value: string) => {
    if (typeof window === 'undefined' || !navigator.clipboard?.writeText) {
      return
    }

    if (!value) {
      return
    }

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true)
      setToast({ text: 'Copied to clipboard!' })


      setTimeout(() => {
        setIsCopied(false)
      }, timeout)
    })
  }

  return { isCopied, copyToClipboard }
}
