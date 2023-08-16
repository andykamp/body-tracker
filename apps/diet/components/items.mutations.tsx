import {
  useMutation,
  QueryClient,
} from '@tanstack/react-query'
import mealApi from "@/diet-server/meal/meal.api"
import {
  addToCacheOnMutate,
  updateCacheOnMutate,
  removeFromCacheOnMutate
} from "../utils/caching";

type UseProductMutationsProps = {
  queryClient: QueryClient
}
export function useMealMutations({
  queryClient
}: UseProductMutationsProps) {

  const addMealMutation = useMutation({
    mutationFn: mealApi.addMeal,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getMealsForCurrentUser'] })
      queryClient.invalidateQueries({ queryKey: ['getDaily'] })
    },
  })

  const updateMealMutation = useMutation({
    mutationFn: mealApi.updateMeal,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getMealsForCurrentUser'] })
      queryClient.invalidateQueries({ queryKey: ['getDaily'] })
    },
  })

  const deleteMealMutation = useMutation({
    mutationFn: mealApi.deleteMeal,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getMealsForCurrentUser'] })
      queryClient.invalidateQueries({ queryKey: ['getDaily'] })
    },
  })


  return {
    addMealMutation,
    updateMealMutation,
    deleteMealMutation,
  }
}

