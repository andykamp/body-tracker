export function parseParams<T>(s: string): T | null {
  if(!s || s === "") return null

  const j = decodeURIComponent(s.slice(1))
    // eslint-disable-next-line quotes
    .replaceAll('"', "\\\"")
    .replaceAll(/&/, "\",\"")
    .replaceAll(/=/, "\":\"")

  return JSON.parse(`{"${j}"}`)
}

export function stringifyParams(o: Record<string, any>) {
  return Object.entries(o)
    .filter(([ _, v ]) => {
      if(v === false || v === 0) return true
      if(v && v?.length === 0) return false
      return !!v
    })
    .map(([ k, v ]) => {
      return `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
    })
    .join("&")
}

export function parseToUrlEncoded(body: any): string {
  const params = Object.fromEntries(
    Object.entries(body).map(([ key, value ]) => {
      return typeof value === "object"
        ? [ key, JSON.stringify(value) ]
        : [ key, value ]
    })
  )
  return stringifyParams(params)
}


