import * as t from "@/diet-server/diet.types";
import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useAuthContext } from "@/auth-client/firebase/Provider";
import productApi from "@/diet-server/product/product.api"
import ProductMenu from "./ProductMenu";
import { useProductMutations } from "./products.mutations";

function Products() {
  const { user } = useAuthContext()

  const queryClient = useQueryClient()

  const productsQuery = useQuery({
    queryKey: ['getProductForCurrentUser'],
    queryFn: () => productApi.getProducts({ userId: user.uid })
  })

  const {
    addProductMutation,
    updateProductMutation,
    deleteProductMutation,
    restoreDeletedProductMutation,
  } = useProductMutations({ queryClient })

  if (!user) {
    return null
  }

  const products: t.Product[] = productsQuery.data || []

  return (
    <ProductMenu
      products={products}
      onChange={(product: t.Product) => {
        console.log('onChange',);
        updateProductMutation.mutate({
          userId: user.uid,
          updatedProduct: product
        })

      }}
      onDelete={async (product: t.Product) => {
        // @todo: add a conformation dialog here
        if (productApi.hasReferences(product)) {
          alert('reference found here and here. We will archive it but hang on to it for your so you can re-store it at ay time')
        }
        // the delete will set isDeleted
        deleteProductMutation.mutate({
          userId: user.uid,
          product: product
        })
      }}
      onRestore={async (product: t.Product) => {
        restoreDeletedProductMutation.mutate({
          userId: user.uid,
          product
        })
      }}
      onCreate={() => {
        console.log('adddd',);
        addProductMutation.mutate({
          userId: user.uid,
          product: productApi.createProductObjectEmpty()
        })
      }}
      isFetching={productsQuery.isFetching}
    />
  )
}

export default Products;

