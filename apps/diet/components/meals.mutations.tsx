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
import { removeProductFromCache } from './products.mutations';

type UseMealMutationsProps = {
  queryClient: QueryClient
}
export function useMealMutations({
  queryClient
}: UseMealMutationsProps) {

  const addMealMutation = useMutation({
    mutationFn: mealApi.addMeal,
    onSettled: (newMeal, error) => {
      if (error) {
        alert('addMealMutation error')
      } else if (newMeal) {
        console.log('addMealMutation successfull', newMeal);
        // update the product state
        addToCacheOnMutate({
          queryClient,
          mutatedObj: newMeal,
          cacheKey: ['getMealsForCurrentUser'],
        })
      }
    }
  })

  const updateMealMutation = useMutation({
    mutationFn: mealApi.updateMeal,
    onSettled: (newMeal, error) => {
      if (error) {
        alert('updateMealMutation error')
      } else if (newMeal) {
        console.log('updateMealMutation successfull', newMeal);
        // update the product state
        updateCacheOnMutate({
          queryClient,
          mutatedObj: newMeal,
          cacheKey: ['getMealsForCurrentUser'],
        })
        // @todo: update the getDailyCache
        queryClient.invalidateQueries({ queryKey: ['getDaily'] })
      }
    }
  })

  const deleteMealMutation = useMutation({
    mutationFn: mealApi.deleteMeal,
    onSettled: (newMeal, error) => {
      if (error) {
        alert('deleteProductMutation error')
      } else if (newMeal) {
        // we only added the isDeleteFlag
        if (newMeal.isDeleted) {
          console.log('deleSuccessfull', newMeal);
          // update the product state
          updateCacheOnMutate({
            queryClient,
            mutatedObj: newMeal,
            cacheKey: ['getMealsForCurrentUser'],
          })
        } else {
          // we have permanently deleted the product and need to remove it from the cache
          console.log('removeFromCache',);
          removeFromCacheOnMutate({
            queryClient,
            mutatedObj: newMeal,
            cacheKey: ['getMealsForCurrentUser'],
          })
          // @todo: update the getDailyCache instead of invalidating it
          queryClient.invalidateQueries({ queryKey: ['getDaily'] })
        }
      }
    }
  })

  const addProductMutation = useMutation({
    mutationFn: mealApi.addProductToMeal,
    onSettled: (data, error) => {
      console.log("settled data", data, error)
      if (error) {
        alert('addPrdouctMutation error')
      } else if (data) {
        const { newMeal, newProduct } = data
        // todo do nutation here
        console.log('onSuccess')
        // update the product cache
        addToCacheOnMutate({
          queryClient,
          mutatedObj: newProduct,
          cacheKey: ['getProductForCurrentUser'],
        })
        // update the meal cache
        updateCacheOnMutate({
          queryClient,
          mutatedObj: newMeal,
          cacheKey: ['getMealsForCurrentUser'],
        })
        // @note: we do NOT need to invalidate the daily beciase no calories have been added
      }
    },
  })

  const updateProductMutation = useMutation({
    mutationFn: mealApi.updateProductFromMeal,
    onSettled: (data, error) => {
      console.log("settled data", data, error)
      if (error) {
        alert('updateProductMutation error')
      } else if (data) {
        // todo decide if original product was changed
        const { newMeal, updatedProduct } = data
        // todo do nutation here
        console.log('onSuccess')
        if (updatedProduct) {
          // update the product cache if we changed a product directly
          updateCacheOnMutate({
            queryClient,
            mutatedObj: updatedProduct,
            cacheKey: ['getProductForCurrentUser'],
          })
        }
        // update the meal cache
        updateCacheOnMutate({
          queryClient,
          mutatedObj: newMeal,
          cacheKey: ['getMealsForCurrentUser'],
        })
        // invalidate the getDaily cache as it might be updated
        // @todo: update the getDailyCache instead of invalidating it
        queryClient.invalidateQueries({ queryKey: ['getDaily'] })
      }
    },
  })

  const convertCustomProductToItemMutation = useMutation({
    mutationFn: mealApi.convertCustomProductToItem,
    onSettled: (data, error) => {
      console.log("settled data", data, error)
      if (error) {
        alert('convertCustomProductToItemMutation error')
      } else if (data) {
        // todo decide if original product was changed
        const { newMeal, customProductToDelete } = data
        // todo do nutation here
        console.log('onSuccess')

        // update the product cache if we changed a product directly
        removeProductFromCache(customProductToDelete, queryClient)

        // update the meal cache
        updateCacheOnMutate({
          queryClient,
          mutatedObj: newMeal,
          cacheKey: ['getMealsForCurrentUser'],
        })
        // invalidate the getDaily cache as it might be updated
        // @todo: update the getDailyCache instead of invalidating it
        queryClient.invalidateQueries({ queryKey: ['getDaily'] })
      }
    },
  })


  const convertItemToCustomProductMutation = useMutation({
    mutationFn: mealApi.convertItemToCustomProduct,
    onSettled: (data, error) => {
      console.log("settled data", data, error)
      if (error) {
        alert('convertCustomProductToItemMutation error')
      } else if (data) {
        // todo decide if original product was changed
        const { newMeal, addedProduct } = data
        // todo do nutation here
        console.log('onSuccess')
        // add the new product to cache
        addToCacheOnMutate({
          queryClient,
          mutatedObj: addedProduct,
          cacheKey: ['getProductForCurrentUser'],
        })
        // update the meal cache
        updateCacheOnMutate({
          queryClient,
          mutatedObj: newMeal,
          cacheKey: ['getMealsForCurrentUser'],
        })
        // invalidate the getDaily cache as it might be updated
        // @todo: update the getDailyCache instead of invalidating it
        queryClient.invalidateQueries({ queryKey: ['getDaily'] })
      }
    },
  })


  const deleteProductMutation = useMutation({
    mutationFn: mealApi.removeProductFromMeal,
    onSettled: (data, error) => {
      if (error) {
        alert('deleteProductMutation error')
      } else if (data) {
        const { newMeal, deletedProduct } = data
        console.log('deleSuccessfull', newMeal);
        // update the product state
        updateCacheOnMutate({
          queryClient,
          mutatedObj: newMeal,
          cacheKey: ['getMealsForCurrentUser'],
        })

        // remove the deleted product if it is deleted
        if (deletedProduct) {
          removeProductFromCache(deletedProduct, queryClient)
        }
        // @todo: update the getDailyCache instead of invalidating it
        queryClient.invalidateQueries({ queryKey: ['getDaily'] })
      }
    }
  })

  return {
    addMealMutation,
    updateMealMutation,
    deleteMealMutation,

    addProductMutation,
    updateProductMutation,
    deleteProductMutation,

    convertCustomProductToItemMutation,
    convertItemToCustomProductMutation,
  }
}

