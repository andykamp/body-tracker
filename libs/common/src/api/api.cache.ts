import { createHash } from "node:crypto"
import type { MakeReqAndExecInput } from "@/common/api/api.types"
import { safeJSONParse } from "@/common/utils/utils.misc"
import redis from "@/common/redis"

const captureException = (e: unknown) => {
  // ... todo implement
  console.error("Error caught! ", e);
}

type Obj = Record<string, any>
type RedisKey = string

const ONE_DAY_IN_SECONDS = 86400

export const DEFAULT_EXP = ONE_DAY_IN_SECONDS
export const DEFAULT_MODE = "EX"
export const KEY_PREFIX = "api"

export function stringifyInput(input: MakeReqAndExecInput) {
  const { proc, vars } = input
  let qs = `${proc}`
  if (vars) qs = `${qs}.${JSON.stringify(vars)}`
  return qs
}

export function generateKey(input: MakeReqAndExecInput) {
  const qs = stringifyInput(input)
  const key = createHash("sha1")
    .update(qs)
    .digest("base64")
  return key
}

function getKey(key: RedisKey) {
  return `${KEY_PREFIX}:${key}`
}

export async function get<Out extends Obj>(key: RedisKey) {
  try {
    const k = getKey(key)
    const res = await redis.get(k)
    if (!res) return null
    return safeJSONParse<Out[]>(res)
  } catch (e) {
    captureException(e)
    return null
  }
}

export async function set(
  key: RedisKey,
  value: Obj | Obj[],
  exp: number | string = DEFAULT_EXP
) {
  try {
    const k = getKey(key)
    const d = JSON.stringify(value)
    await redis.set(k, d, DEFAULT_MODE, exp)
  } catch (e) {
    captureException(e)
  }
}

const apiCache = {
  generateKey,
  get,
  set
}

export type ApiCache = typeof apiCache
export default apiCache
