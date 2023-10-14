import type * as t from '@/diet/types/openai';
import { parse, _fetch } from "@/common/utils/utils.fetch";
import productApi from '@/diet-server/product/product.api';

export function formatOpenAiMessage(msg: string) {
  return { role: 'user', content: msg } as t.ChatGPTMessage

}

export async function sendPrompt(msg: string) {
  const message = formatOpenAiMessage(msg)
  const body: t.ChatInput = {
    messages: [message],
  }

  // get oda search results
  const completion = await _fetch(`/api/askOpenai`, {
    method: 'POST',
    body: JSON.stringify(body)
  });

  const parsedCompletion = await parse(completion) as t.ChatGPTProductResponse
  console.log('parsedCompletion',parsedCompletion );
  return parseResponse(parsedCompletion)

}

export function parseResponse(res: t.ChatGPTProductResponse) {
  const { content } = res
  const arr = JSON.parse(content as string)
  console.log('arr',arr );

  return arr.map((item: any) => productApi.createProductObject(item))
}
