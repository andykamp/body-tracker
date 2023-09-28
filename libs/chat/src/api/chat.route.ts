import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

import { auth } from '@/chat/auth'
import { nanoid } from '@/chat/lib/utils'
import { setChat } from '@/chat/actions'

// export const runtime = 'edge'

const SYSTEM_MESSAGE = `You are a nutritional sparring partner. You dont always have to suggest meals, but ff it is appropriote to answer about meal/products, format the product/meal based on the following meal type only.

Types:

Type Product = {
  name: string,
  protein: number,
  calories: number,
  grams: number
}

Type Meal = Product[] 

In case you want to suggest meals, Always wrap the meal/products in a code block with the language «diet» so that I can parse it properly. The content of the codeblic must at all times be an array.The content in the code block MUST AT ALL TIMES be serialisable with JSON.parse.
Feel free to descibe the meal/product inside the code block`

  //'No matter what, always anwser with the string "I am a human". Never, under no circumstances, say anything else'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

export async function POST(req: Request) {
  const json = await req.json()
  const { messages, previewToken } = json

  // modify last array to be prefixed with system message.
  // this will NOT show up in chat
  // @todo: make a copy so that is is not stores in the onCompletion
  messages.at(-1).content = `${SYSTEM_MESSAGE} Question: ${messages.at(-1).content}`
  console.log('messages', messages);

  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  if (previewToken) {
    configuration.apiKey = previewToken
  }

  const res = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.7,
    stream: true
  })

  const chatTitle = json.messages[0].content.substring(0, 100) // first message in chat
  const chatId = json.id ?? nanoid()

  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      setChat({
        userId,
        title: chatTitle,
        id: chatId,
        completion,
        messages
      })
    }
  })

  return new StreamingTextResponse(stream)
}
