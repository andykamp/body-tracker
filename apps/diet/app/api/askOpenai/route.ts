import { NextResponse } from "next/server"
import OpenAI from 'openai';

import { ChatGPTFunction } from "@/diet/types/openai";

// example curl command:
// curl -X POST -H "Content-Type: application/json" -d '{"messages": [{ "role": "user", "content": "Say this is a test" }]}' http://localhost:4200/api/askOpenai


const presetMacros = `You are a meal adviser answering questions about how much protein and calories there is in meals and products. Answer the question on the following format only. If you have no answer, answer with an empty array ([]).

Type Product = {
  name: string,
  protein: number,
  calories: number,
  grams: number
}

Type Meal = Product[]

If the question is about a a single product. Answer with a single Product type wrapped in an array. Always answer in 100grams.
If the question is about a meal, or something containing more products, answer with the meal type where each product is the ingredient you think is inside the meal. In this case, always  adjust the grams in each product inside the meal to be for one serving size of the meal`;

// example curl command:
// curl -X POST -H "Content-Type: application/json" -d '{"messages": [{ "role": "user", "content": "pasta carbonara" }]}' http://localhost:4200/api/askOpenai


const functions: ChatGPTFunction[] = [

]

export async function POST(request: Request) {
  // Get formData from request
  const body = await request.json()
  const { messages, api_key } = body

  console.log('messages', messages);
  const apiKey = process.env.OPENAI_API_KEY ?? api_key
  console.log('apiKey', apiKey);

  if (apiKey === undefined) {
    console.log("No API key provided.")
    return NextResponse.json(
      {
        message: "No API key provided.",
      },
      {
        status: 401,
      }
    )
  }
  const openai = new OpenAI({
    apiKey
  });

  try {
    console.log("Creating chat completion...")
    const completion = await openai.chat.completions.create({
      model: "gpt-4-0613",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant. Do not include any explanations, only provide a  RFC8259 compliant JSON response  following this format without deviation." + presetMacros
        },
        ...messages,
      ],
      // functions,
      temperature: 0.6,
      max_tokens: 1000,
      /* function_call: "auto" */
    })
    console.log('completino');
    console.dir(completion, { depth: null, color: true });


    return NextResponse.json(completion.choices[0].message)
  } catch (error: any) {
    if (error.response) {
      console.log(error.response.status)
      console.log(error.response.data)
      return NextResponse.json({
        message: error.response.data?.error?.message ?? "Unknown error",
      })
    } else {
      console.log(error)
      return NextResponse.json({
        message: error.error?.message ?? "Unknown error",
      })
    }
  }
}
