import { stringifyParams, parseToUrlEncoded } from "@/common/utils/utils.http"

export type FetchOptions = RequestInit & {
  params?: Record<string, any>
}

export async function fetch(
  url: string,
  options?: FetchOptions
) {
  if (options?.params) {
    url = `${url}?${stringifyParams(options.params)}`
  }

  if (options?.body && options?.headers?.["Content-Type"] === "application/x-www-form-urlencoded") {
    parseToUrlEncoded(options.body)
  } else if (typeof options?.body === "object") {
    options.body = JSON.stringify(options.body)
  }

  try {
    const res = await fetch(url, {
      ...options,
      method: options?.method?.toUpperCase() || "GET"
    })
    if (!res.ok) throw new Error(res.statusText)
    return res
  } catch (error) {
    throw new Error("Fetch call failed", {
      cause: error,
    })
  }
}

type ParseType = "json" | "text"

export function parse<T>(res: Response, type: ParseType = "json") {
  if (type === "json") return res.json() as Promise<T>
  if (type === "text") return res.text() as Promise<T>
  throw new Error(`Yet to add support for ${type}`)
}

