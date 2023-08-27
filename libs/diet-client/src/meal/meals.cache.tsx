import type * as t from "@/diet-server/diet.types"
import {
  QueryClient,
} from '@tanstack/react-query'
import {
  addToCacheOnMutate,
  updateCacheOnMutate,
  removeFromCacheOnMutate
} from "@/diet-client/utils/caching";

export const mealCacheKeys = {
  getMeals: ['getMealsForCurrentUser']
}

function addMeal(meal: t.Meal, queryClient: QueryClient) {
  addToCacheOnMutate({
    queryClient,
    mutatedObj: meal,
    cacheKey: mealCacheKeys.getMeals,
  })
}

function updateMeal(meal: t.Meal, queryClient: QueryClient) {
  updateCacheOnMutate({
    queryClient,
    mutatedObj: meal,
    cacheKey: mealCacheKeys.getMeals,
  })
}
function removeMeal(meal: t.Meal, queryClient: QueryClient) {
  removeFromCacheOnMutate({
    queryClient,
    mutatedObj: meal,
    cacheKey: mealCacheKeys.getMeals,
  })
}

const mealCacheApi = {
  addMeal,
  updateMeal,
  removeMeal,
}
export type MealCacheApi = typeof mealCacheApi
export default mealCacheApi

