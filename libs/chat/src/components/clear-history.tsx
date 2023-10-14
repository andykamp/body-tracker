'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

import { ServerActionResult } from '@/chat/lib/types'
import { Button } from '@geist-ui/core'
import Confirm from '@/chat/components/ui/confirm'
import { IconSpinner } from '@/chat/components/ui/icons'
import {
  IconTrash,
} from '@/chat/components/ui/icons'

interface ClearHistoryProps {
  clearChats: () => ServerActionResult<void>
}

export function ClearHistory({ clearChats }: ClearHistoryProps) {
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()
  const router = useRouter()

  return (
    <Confirm
      shown={open}
      title='Are you absolutely sure?'
      content="This will permanently delete your chat history and remove your data
            from our servers."
      onClose={() => setOpen(false)}
      onConfirmDisabled={isPending}
      onConfirm={async () => {
        const result = await clearChats()

        if (result && 'error' in result) {
          toast.error(result.error)
          return
        }

        startTransition(() => {
          setOpen(false)
          router.push('console/chat')
        })
      }}
    >
      <Button
        auto
        disabled={isPending}
        iconRight={isPending ? <IconSpinner className="mr-2" /> : <IconTrash />}
        onClick={() => setOpen(true)}
      />
    </Confirm>
  )
}
