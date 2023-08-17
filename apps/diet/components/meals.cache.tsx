import type * as t from "@/diet-server/diet.types"
import {
  QueryClient,
} from '@tanstack/react-query'
import {
  addToCacheOnMutate,
  updateCacheOnMutate,
  removeFromCacheOnMutate
} from "../utils/caching";

export const productCacheKeys = {
  getMeals: ['getMealsForCurrentUser']
}

function addMeal(meal: t.Meal, queryClient: QueryClient) {
  addToCacheOnMutate({
    queryClient,
    mutatedObj: meal,
    cacheKey: productCacheKeys.getMeals,
  })
}

function updateMeal(meal: t.Meal, queryClient: QueryClient) {
  updateCacheOnMutate({
    queryClient,
    mutatedObj: meal,
    cacheKey: productCacheKeys.getMeals,
  })
}
function removeMeal(meal: t.Meal, queryClient: QueryClient) {
  removeFromCacheOnMutate({
    queryClient,
    mutatedObj: meal,
    cacheKey: productCacheKeys.getMeals,
  })
}

const mealCacheApi = {
  addMeal,
  updateMeal,
  removeMeal,
}
export type MealCacheApi = typeof mealCacheApi
export default mealCacheApi

