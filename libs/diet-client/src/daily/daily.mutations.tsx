import {
  useMutation,
  QueryClient,
} from '@tanstack/react-query'
import dailyApi from "@/diet-server/daily/daily.api"
import dailyCacheApi, {dailyCacheKeys} from '@/diet-client/daily/daily.cache'

type UseDailyMutationsProps = {
  queryClient: QueryClient
}
export function useDailyMutations({
  queryClient
}: UseDailyMutationsProps) {

  const addDailyProductMutation = useMutation({
    mutationFn: dailyApi.addDailyProduct,
    onSettled: (data, error) => {
      if (error) {
        alert('addDailyProductMutation error')
      } else if (data) {
        console.log('addDailyProductMutation success',data );
        dailyCacheApi.updateDaily(data.newDaily, queryClient)
        // queryClient.invalidateQueries({ queryKey: dailyCacheKeys.getDaily })
      }
    }
  })

  const addDailyMealMutation = useMutation({
    mutationFn: dailyApi.addDailyMeal,
    onSettled: (data, error) => {
      if (error) {
        alert('addDailyMealMutation error')
      } else if (data) {
        console.log('addDailyMealMutation success',data );
        dailyCacheApi.updateDaily(data.newDaily, queryClient)
        // queryClient.invalidateQueries({ queryKey: dailyCacheKeys.getDaily })
      }
    }
  })

  const updateDailyMutation = useMutation({
    mutationFn: dailyApi.updateDaily,
    onSettled: (updatedDaily, error) => {
      if (error) {
        alert('updateDailyMutation error')
      } else if (updatedDaily) {
        console.log('updateDailyMutation success',updatedDaily );
        dailyCacheApi.updateDaily(updatedDaily, queryClient)
        // queryClient.invalidateQueries({ queryKey: dailyCacheKeys.getDaily })
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
        dailyCacheApi.updateDaily(data.newDaily, queryClient)
        // queryClient.invalidateQueries({ queryKey: dailyCacheKeys.getDaily })
      }
    }
  })

  const updateItemMutation = useMutation({
    mutationFn: dailyApi.updateItem,
    onSettled: (data, error) => {
      if (error) {
        alert('updateItemMutation error')
      } else if (data) {
        console.log('updateItemMutation success',data );
        dailyCacheApi.updateDaily(data.newDaily, queryClient)
        // queryClient.invalidateQueries({ queryKey: dailyCacheKeys.getDaily })
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
        dailyCacheApi.updateDaily(data.newDaily, queryClient)
        // queryClient.invalidateQueries({ queryKey: dailyCacheKeys.getDaily })
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
        dailyCacheApi.updateDaily(data.newDaily, queryClient)
        // queryClient.invalidateQueries({ queryKey: dailyCacheKeys.getDaily })
      }
    }
  })

  return {
    addDailyProductMutation,
    addDailyMealMutation,
    updateDailyMutation,

    updateItemMutation,
    deleteItemMutation,
    convertCustomItemToItemMutation,
    convertItemToCustomItemMutation,
  }
}

