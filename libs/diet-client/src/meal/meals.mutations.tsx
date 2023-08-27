import {
  useMutation,
  QueryClient,
} from '@tanstack/react-query'
import mealApi from "@/diet-server/meal/meal.api"
import productCacheApi from '@/diet-client/product/products.cache';
import mealCacheApi from '@/diet-client/meal/meals.cache'
import { dailyCacheKeys } from '@/diet-client/daily/daily.cache'

type UseMealMutationsProps = {
  queryClient: QueryClient
}
export function useMealMutations({
  queryClient
}: UseMealMutationsProps) {

  const addMealMutation = useMutation({
    mutationFn: mealApi.addMeal,
    onSettled: (addedMeal, error) => {
      if (error) {
        alert('addMealMutation error')
      } else if (addedMeal) {
        console.log('addMealMutation successfull', addedMeal);
        // update the product state
        mealCacheApi.addMeal(addedMeal, queryClient)
      }
    }
  })

  const updateMealMutation = useMutation({
    mutationFn: mealApi.updateMeal,
    onSettled: (updatedMeal, error) => {
      if (error) {
        alert('updateMealMutation error')
      } else if (updatedMeal) {
        console.log('updateMealMutation successfull', updatedMeal);
        // update the product state
        mealCacheApi.updateMeal(updatedMeal, queryClient)
        // @todo: update the getDailyCache
        queryClient.invalidateQueries({ queryKey: dailyCacheKeys.getDaily })
      }
    }
  })

  const deleteMealMutation = useMutation({
    mutationFn: mealApi.deleteMeal,
    onSettled: (deletedMeal, error) => {
      if (error) {
        alert('deleteProductMutation error')
      } else if (deletedMeal) {
        // we only added the isDeleteFlag
        if (deletedMeal.isDeleted) {
          console.log('deleSuccessfull deleteMealMutation', deletedMeal);
          // update the product state
          mealCacheApi.updateMeal(deletedMeal, queryClient)
        } else {
          // we have permanently deleted the product and need to remove it from the cache
          console.log('removeFromCache',);
          mealCacheApi.removeMeal(deletedMeal, queryClient)
          // @todo: update the getDailyCache instead of invalidating it
          queryClient.invalidateQueries({ queryKey: dailyCacheKeys.getDaily })
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
        // @todo: rename to addedMeal
        const { newMeal, newProduct } = data
        // todo do nutation here
        console.log('onSuccess addProductMutation')
        // update the product cache
        productCacheApi.addProduct(newProduct, queryClient)
        // update the meal cache
        mealCacheApi.updateMeal(newMeal, queryClient)
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
        // @todo: rename to updatedMeal
        // todo decide if original product was changed
        const { newMeal, updatedProduct } = data
        // todo do nutation here
        console.log('onSuccess updateProductMutation')
        if (updatedProduct) {
          // update the product cache if we changed a product directly
          productCacheApi.updateProduct(updatedProduct, queryClient)
        }
        // update the meal cache
        mealCacheApi.updateMeal(newMeal, queryClient)
        // invalidate the getDaily cache as it might be updated
        // @todo: update the getDailyCache instead of invalidating it
        queryClient.invalidateQueries({ queryKey: dailyCacheKeys.getDaily })
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
        // @todo: rename to something more descriptive
        // todo decide if original product was changed
        const { newMeal, customProductToDelete } = data
        // todo do nutation here
        console.log('onSuccess convertCustomProductToItemMutation')

        // update the product cache if we changed a product directly
        productCacheApi.removeProduct(customProductToDelete, queryClient)

        // update the meal cache
        mealCacheApi.updateMeal(newMeal, queryClient)
        // invalidate the getDaily cache as it might be updated
        // @todo: update the getDailyCache instead of invalidating it
        queryClient.invalidateQueries({ queryKey: dailyCacheKeys.getDaily })
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
        // @todo: rename to something more descriptive
        // todo decide if original product was changed
        const { newMeal, addedProduct } = data
        // todo do nutation here
        console.log('onSuccess convertItemToCustomProductMutation')
        // add the new product to cache
        productCacheApi.addProduct(addedProduct, queryClient)
        // update the meal cache
        mealCacheApi.updateMeal(newMeal, queryClient)
        // invalidate the getDaily cache as it might be updated
        // @todo: update the getDailyCache instead of invalidating it
        queryClient.invalidateQueries({ queryKey: dailyCacheKeys.getDaily })
      }
    },
  })

  const deleteProductMutation = useMutation({
    mutationFn: mealApi.removeProductFromMeal,
    onSettled: (data, error) => {
      if (error) {
        alert('deleteProductMutation error')
      } else if (data) {
        // @todo: rename to something more descriptive
        const { newMeal, deletedProduct } = data
        console.log('onSuccess deleteProductMutation', newMeal);
        // update the product state
        mealCacheApi.updateMeal(newMeal, queryClient)
        // remove the deleted product if it is deleted
        if (deletedProduct) {
          productCacheApi.removeProduct(deletedProduct, queryClient)
        }
        // @todo: update the getDailyCache instead of invalidating it
        queryClient.invalidateQueries({ queryKey: dailyCacheKeys.getDaily })
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

