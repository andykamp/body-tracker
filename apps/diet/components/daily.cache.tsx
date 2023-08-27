import type * as t from "@/diet-server/diet.types"
import {
  QueryClient,
} from '@tanstack/react-query'
import {
  addToCacheOnMutate,
  updateCacheOnMutate,
  removeFromCacheOnMutate
} from "../utils/caching";

export const dailyCacheKeys = {
  getDaily: ['getDaily']
}

function addDaily(daily: t.DailyDiet, queryClient: QueryClient) {
  addToCacheOnMutate({
    queryClient,
    mutatedObj: daily,
    cacheKey: dailyCacheKeys.getDaily,
  })
}

function updateDaily(daily: t.DailyDiet, queryClient: QueryClient) {
  updateCacheOnMutate({
    queryClient,
    mutatedObj: daily,
    cacheKey: dailyCacheKeys.getDaily,
  })
}
function removeDaily(daily: t.DailyDiet, queryClient: QueryClient) {
  removeFromCacheOnMutate({
    queryClient,
    mutatedObj: daily,
    cacheKey: dailyCacheKeys.getDaily,
  })
}

const DailyCacheApi = {
  addDaily,
  updateDaily,
  removeDaily,
}

export type MealCacheApi = typeof DailyCacheApi
export default DailyCacheApi

