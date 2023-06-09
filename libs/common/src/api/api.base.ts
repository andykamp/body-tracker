import * as t from '@/common/api/api.types'
// import apiCache from '@/common/api/api.cache'
import {stripUndefinedFields} from '@/common/utils/utils.misc'

export type ApiInterface = {
  [key: string]: any;
};

// intilize the base api with a specific api
function initApi(api: ApiInterface) {
  baseApi.api = api
}

// returns the api to use based on the env variable
function getApiToUse(availableApis: Record<string, ApiInterface>) {
  const CRUD_TO_USE = process.env.NEXT_PUBLIC_API_TO_USE || "firebase";
  return availableApis[CRUD_TO_USE];
}

// returns the correct function given the current
function makeRequest(proc: string) {
  if (!baseApi.api) throw new Error(`baseApi.api is not initialized`)
  if (!baseApi.api[proc]) throw new Error(`API ${baseApi.api} does not have a function ${proc}`)
  return baseApi.api[proc]

}

async function makeReqAndExec<Out extends Record<string, unknown>>(
  input: t.MakeReqAndExecInput
) {
  const { cache, proc } = input

  // strip the inputs of undefined fields
  // some databases (firestore) dont like undefined fields
  const vars = stripUndefinedFields(input.vars)

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
  api: null as unknown as ApiInterface,
  initApi,
  getApiToUse,
  makeRequest,
  makeReqAndExec
}

export type BaseApi = typeof baseApi
export default baseApi
