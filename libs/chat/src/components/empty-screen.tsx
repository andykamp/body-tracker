import { UseChatHelpers } from 'ai/react'

import { Button } from '@/chat/components/ui/button'
import { IconArrowRight } from '@/chat/components/ui/icons'
import { Link } from '@geist-ui/core'

const exampleMessages = [
  {
    heading: 'How many calories does pasta carbonara have?',
    message: 'How many calories does pasta carbonara have?',
  },
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          Welcome to Next.js AI Chatbot!
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          This is an open source AI chatbot app template generated from {' '}
          <Link color href="https://github.com/vercel-labs/ai-chatbot">Next.js</Link>
        </p>
        <p className="leading-normal text-muted-foreground">
          You can start a conversation here or try the following examples:
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => setInput(message.message)}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
