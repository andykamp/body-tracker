import * as t from '@/common/api/api.types'
// import apiCache from '@/common/api/api.cache'
import firebaseApi from '@/common/api/api.firebase'

const API_TO_USE = process.env.NEXT_PUBLIC_API_TO_USE || "firebase"

const AVAILABLE_APIS_TO_USE = {
  firebase: firebaseApi,
}

// returns the correct function given the current
function makeRequest(proc: string) {
  const api = AVAILABLE_APIS_TO_USE[API_TO_USE]
  const f = api[proc]
  if (!f) throw new Error(`API ${API_TO_USE} does not have a function ${proc}`)
  return f
}

async function makeReqAndExec<Out extends Record<string, unknown>>(
  input: t.MakeReqAndExecInput
) {
  const { cache, vars, proc } = input

  try {
    let cacheKey: string

    // if (cache) {
    //   cacheKey = apiCache.generateKey(input)
    //   const res = await apiCache.get<Out>(cacheKey)
    //   if (res) {
    //     // cache hits
    //     return res
    //   }
    // }

    const req = baseApi.makeRequest(proc)
    const res = await req?.(vars)
    const out = res

    // write result to cache if cache is enabled
    // if (cache && cacheKey) {
    //   await apiCache.set(cacheKey, out)
    // }

    return out
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    } else {
      throw new Error(e as string);
    }
  }

}

const baseApi = {
  makeRequest,
  makeReqAndExec
}

export type BaseApi = typeof baseApi
export default baseApi
