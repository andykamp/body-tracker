import * as t from '@/common/api/api.types'
// import apiCache from '@/common/api/api.cache'


type ApiInterface = {
  [key: string]: any;
};

// intilize the base api with a specific api
function initApi(api: ApiInterface) {
  if(baseApi.api) console.log('baseapi.api already set', );
  baseApi.api = api
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
  console.log('makeReqAndExec_input',input );
  console.log('makeReqAndExec_api',baseApi.api );
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
  api: null,
  initApi,
  makeRequest,
  makeReqAndExec
}

export type BaseApi = typeof baseApi
export default baseApi
