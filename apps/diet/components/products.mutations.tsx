import type * as t from "@/diet-server/diet.types"
import {
  useMutation,
  QueryClient,
} from '@tanstack/react-query'
import productApi from "@/diet-server/product/product.api"
import {
  addToCacheOnMutate,
  updateCacheOnMutate,
  removeFromCacheOnMutate
} from "../utils/caching";

export function removeProductFromCache(product: t.Product, queryClient: QueryClient) {
  // we only added the isDeleteFlag
  if (product.isDeleted) {
    console.log('deleSuccessfull', product);
    // update the product state
    updateCacheOnMutate({
      queryClient,
      mutatedObj: product,
      cacheKey: ['getProductForCurrentUser'],
    })
  } else {
    // we have permanently deleted the product and need to remove it from the cache
    console.log('removeFromCache',);
    removeFromCacheOnMutate({
      queryClient,
      mutatedObj: product,
      cacheKey: ['getProductForCurrentUser'],
    })
  }

}

type UseProductMutationsProps = {
  queryClient: QueryClient
}
export function useProductMutations({
  queryClient
}: UseProductMutationsProps) {


  // @todo: extract the delteItem condition into a own function

  const addProductMutation = useMutation({
    mutationFn: productApi.addProduct,
    onSettled: (newProduct, error) => {
      if (error) {
        alert('addProductMutation error')
      } else if (newProduct) {
        console.log('addProductMutation successfull', newProduct);
        // update the product state
        addToCacheOnMutate({
          queryClient,
          mutatedObj: newProduct,
          cacheKey: ['getProductForCurrentUser'],
        })
      }
    }
  })

  const updateProductMutation = useMutation({
    mutationFn: productApi.updateProduct,
    onSettled: (newProduct, error) => {
      if (error) {
        alert('updateProductMutation error')
      } else if (newProduct) {
        console.log('updateProductMutation successfull', newProduct);
        // update the product state
        updateCacheOnMutate({
          queryClient,
          mutatedObj: newProduct,
          cacheKey: ['getProductForCurrentUser'],
        })
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ['getDaily'] })
      }
    }
  })

  const deleteProductMutation = useMutation({
    mutationFn: productApi.deleteProduct,
    onSettled: (newProduct, error) => {
      if (error) {
        alert('deleteProductMutation error')
      } else if (newProduct) {
        removeProductFromCache(newProduct, queryClient)
      }
    }
  })

  const restoreDeletedProductMutation = useMutation({
    mutationFn: productApi.restoreDeletedProduct,
    onSettled: (newProduct, error) => {
      if (error) {
        alert('restoreDeletedProductMutation error')
      } else if (newProduct) {
        console.log('restoreSuccessfull', newProduct);
        // update the product state
        updateCacheOnMutate({
          queryClient,
          mutatedObj: newProduct,
          cacheKey: ['getProductForCurrentUser'],
        })
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

