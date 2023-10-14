export type ChatGPTAgent = "user" | "system" | "assistant"

export type ChatInput = {
  messages: ChatGPTMessage[]
}

export type ChatOutputContent = {
  index: number
  message: ChatGPTMessage
  finish_reason: string
}

export type ChatOutput = {
  id: string,
  object: string
  created: number
  model: string
  choices: ChatOutputContent[]
  usage: { prompt_tokens: number, completion_tokens: number, total_tokens: number }
}

export type ChatGPTMessage = {
  role: ChatGPTAgent
  content: string
}
export type ChatGPTProductResponse = {
  role: ChatGPTAgent
  content: string
}

export type ChatGPTFunction = {
  name: string
  description: string
  parameters: {
    type: string
    properties: {
      [key: string]: {
        type: string
        description: string
        enum?: string[]
      }
    }
    required: string[]
  }
}

export type OpenAIStreamPayload = {
  model: "gpt-3.5-turbo-0613" | "gpt-4-0613"
  messages: ChatGPTMessage[]
  functions?: ChatGPTFunction[]
  temperature: number
  max_tokens: number
  stream: boolean
  api_key: string
}
