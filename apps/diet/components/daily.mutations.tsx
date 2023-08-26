import {
  useMutation,
  QueryClient,
} from '@tanstack/react-query'
import dailyApi from "@/diet-server/daily/daily.api"
import dailyCacheApi , {dailyCacheKeys} from './daily.cache'

type UseDailyMutationsProps = {
  queryClient: QueryClient
}
export function useDailyMutations({
  queryClient
}: UseDailyMutationsProps) {

  const addDailyItemMutation = useMutation({
    mutationFn: dailyApi.addDailyItem,
    onSettled: (addedMeal, error) => {
      if (error) {
        alert('addDailyItemMutation error')
      } else if (addedMeal) {
        console.log('addDailyItemMutation success',addedMeal );
        queryClient.invalidateQueries({ queryKey: dailyCacheKeys.getDaily })
      }
    }
  })

  const updateDailyMutation = useMutation({
    mutationFn: dailyApi.updateDaily,
    onSettled: (updatedMeal, error) => {
      if (error) {
        alert('updateDailyMutation error')
      } else if (updatedMeal) {
        console.log('updateDailyMutation success',updatedMeal );
        queryClient.invalidateQueries({ queryKey: dailyCacheKeys.getDaily })
      }
    }
  })

  const deleteItemMutation = useMutation({
    mutationFn: dailyApi.deleteDailyItem,
    onSettled: (data, error) => {
      if (error) {
        alert('deleteItemMutation error')
      } else if (data) {
        console.log('deleteItemMutation success',data );
        queryClient.invalidateQueries({ queryKey: dailyCacheKeys.getDaily })
      }
    }
  })

  // -----------------------------------

  const updateItemMutation = useMutation({
    mutationFn: dailyApi.updateItem,
    onSettled: (data, error) => {
      if (error) {
        alert('updateItemMutation error')
      } else if (data) {
        console.log('updateItemMutation success',data );
        queryClient.invalidateQueries({ queryKey: dailyCacheKeys.getDaily })
      }
    }
  })


  const convertCustomItemToItemMutation = useMutation({
    mutationFn: dailyApi.convertCustomItemToItem,
    onSettled: (data, error) => {
      if (error) {
        alert('convertCustomItemToItemMutation error')
      } else if (data) {
        console.log('convertCustomItemToItemMutation success',data );
        queryClient.invalidateQueries({ queryKey: dailyCacheKeys.getDaily })
      }
    }
  })

  const convertItemToCustomItemMutation = useMutation({
    mutationFn: dailyApi.convertItemToCustomItem,
    onSettled: (data, error) => {
      if (error) {
        alert('convertItemToCustomItemMutation error')
      } else if (data) {
        console.log('convertItemToCustomItemMutation success',data );
        queryClient.invalidateQueries({ queryKey: dailyCacheKeys.getDaily })
      }
    }
  })

  return {
    addDailyItemMutation,
    updateDailyMutation,

    updateItemMutation,
    deleteItemMutation,
    convertCustomItemToItemMutation,
    convertItemToCustomItemMutation,
  }
}

