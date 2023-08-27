import {
  useMutation,
  QueryClient,
} from '@tanstack/react-query'
import productApi from "@/diet-server/product/product.api"
import productCacheApi from '@/diet-client/product/products.cache';
import { mealCacheKeys } from '@/diet-client/meal/meals.cache';

type UseProductMutationsProps = {
  queryClient: QueryClient
}

export function useProductMutations({
  queryClient
}: UseProductMutationsProps) {

  const addProductMutation = useMutation({
    mutationFn: productApi.addProduct,
    onSettled: (addedProduct, error) => {
      if (error) {
        alert('addProductMutation error')
      } else if (addedProduct) {
        console.log('addProductMutation successfull', addedProduct);
        // update the product state
        productCacheApi.addProduct(addedProduct, queryClient)
      }
    }
  })

  const updateProductMutation = useMutation({
    mutationFn: productApi.updateProduct,
    onSettled: (updatedProduct, error) => {
      if (error) {
        alert('updateProductMutation error')
      } else if (updatedProduct) {
        console.log('updateProductMutation successfull', updatedProduct);
        // update the product state
        productCacheApi.updateProduct(updatedProduct, queryClient)
        // update related meals referencing the product

        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: mealCacheKeys.getMeals })
        queryClient.invalidateQueries({ queryKey: ['getDaily'] })
      }
    }
  })

  const deleteProductMutation = useMutation({
    mutationFn: productApi.deleteProduct,
    onSettled: (deletedProduct, error) => {
      if (error) {
        alert('deleteProductMutation error')
      } else if (deletedProduct) {
        productCacheApi.removeProduct(deletedProduct, queryClient)
      }
    }
  })

  const restoreDeletedProductMutation = useMutation({
    mutationFn: productApi.restoreDeletedProduct,
    onSettled: (restoredProduct, error) => {
      if (error) {
        alert('restoreDeletedProductMutation error')
      } else if (restoredProduct) {
        console.log('restoreSuccessfull', restoredProduct);
        // update the product state
        productCacheApi.updateProduct(restoredProduct, queryClient)
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ['getDaily'] })
      }
    },
  })

  return {
    addProductMutation,
    updateProductMutation,
    deleteProductMutation,
    restoreDeletedProductMutation,
  }
}

