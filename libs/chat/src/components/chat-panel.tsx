import { type UseChatHelpers } from 'ai/react'

import { Button } from '@geist-ui/core'
import { PromptForm } from '@/chat/components/prompt-form'
import { ButtonScrollToBottom } from '@/chat/components/button-scroll-to-bottom'
import { FooterText } from '@/chat/components/footer'
import { RefreshCw, StopCircle } from '@geist-ui/icons'

export interface ChatPanelProps
  extends Pick<
    UseChatHelpers,
    | 'append'
    | 'isLoading'
    | 'reload'
    | 'messages'
    | 'stop'
    | 'input'
    | 'setInput'
  > {
  id?: string
}

export function ChatPanel({
  id,
  isLoading,
  stop,
  append,
  reload,
  input,
  setInput,
  messages
}: ChatPanelProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="flex h-10 items-center justify-center">
          {isLoading ? (
            <Button
              auto
              onClick={() => stop()}
              className="bg-background"
              icon={<StopCircle />}
            >
              Stop generating
            </Button>
          ) : (
            messages?.length > 0 && (
              <Button
                  auto
                onClick={() => reload()}
                className="bg-background"
                icon={<RefreshCw />}
              >
                Regenerate response
              </Button>
            )
          )}
        </div>
        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptForm
            onSubmit={async value => {
              await append({
                id,
                content: value,
                role: 'user'
              })
            }}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
          />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  )
}
