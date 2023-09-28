import { type Message as AiMessage } from 'ai'

export type Message = AiMessage

export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: number
  userId: string
  path: string
  messages: Message[]
  sharePath?: string
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
    error: string
  }
>
