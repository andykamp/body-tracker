'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

import { type Chat, ServerActionResult } from '@/chat/lib/types'
import Confirm from '@/chat/components/ui/confirm'
import { Button } from '@geist-ui/core'
import {
  IconSpinner,
  IconTrash,
} from '@/chat/components/ui/icons'
import { Tooltip } from '@geist-ui/core'

interface SidebarActionsProps {
  chat: Chat
  removeChat: (args: { id: string; path: string }) => ServerActionResult<void>
  shareChat: (chat: Chat) => ServerActionResult<Chat>
}

export function SidebarActions({
  chat,
  removeChat,
}: SidebarActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [isRemovePending, startRemoveTransition] = React.useTransition()
  const router = useRouter()


  return (
    <>
      <div className="space-x-1">
        <Confirm
          shown={deleteDialogOpen}
          title='Are you absolutely sure?'
          content='This will permanently delete your chat message and remove your data from our servers.'
          onClose={() => setDeleteDialogOpen(false)}
          onConfirmText={
            <>
              {isRemovePending && <IconSpinner className="mr-2 animate-spin" />}
              Delete
            </>
          }
          onConfirmDisabled={isRemovePending}
          onConfirm={async () => {
            const result = await removeChat({
              id: chat.id,
              path: chat.path
            })

            startRemoveTransition(() => {
              if (result && 'error' in result) {
                toast.error(result.error)
                return
              }

              setDeleteDialogOpen(false)
              router.refresh()
              router.push('/')
              toast.success('Chat deleted')
            })
          }}
        >
          <Tooltip text="Delete Chat" >
            <Button
              auto
              scale={0.3}
              className="h-6 w-6 p-0 hover:bg-background"
              disabled={isRemovePending}
              onClick={() => setDeleteDialogOpen(true)}
              iconRight={<IconTrash />}
            />
          </Tooltip>
        </Confirm>
      </div>
    </>
  )
}
