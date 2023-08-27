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
  getProducts: ['getProductForCurrentUser']
}

function addProduct(product: t.Product, queryClient: QueryClient) {
  addToCacheOnMutate({
    queryClient,
    mutatedObj: product,
    cacheKey: productCacheKeys.getProducts,
  })
}

function updateProduct(product: t.Product, queryClient: QueryClient) {
  updateCacheOnMutate({
    queryClient,
    mutatedObj: product,
    cacheKey: productCacheKeys.getProducts,
  })
}

export function removeProduct(product: t.Product, queryClient: QueryClient) {
  // we only added the isDeleteFlag
  if (product.isDeleted) {
    console.log('softDelete', product);
    // update the product state
    updateCacheOnMutate({
      queryClient,
      mutatedObj: product,
      cacheKey: productCacheKeys.getProducts,
    })
  } else {
    // we have permanently deleted the product and need to remove it from the cache
    console.log('hard delete', product);
    removeFromCacheOnMutate({
      queryClient,
      mutatedObj: product,
      cacheKey: productCacheKeys.getProducts,
    })
  }
}

const productCacheApi = {
  addProduct,
  updateProduct,
  removeProduct,
}

export type ProductCacheApi = typeof productCacheApi
export default productCacheApi


