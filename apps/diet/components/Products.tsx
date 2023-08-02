import * as t from "@/diet-server/diet.types";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useAuthContext } from "@/auth-client/firebase/Provider";
import productApi from "@/diet-server/product/product.api"
import { createEmptyProduct } from '@/diet/utils/misc'
import ProductMenu from "./ProductMenu";

function Products() {
  const { user } = useAuthContext()

  const queryClient = useQueryClient()

  const productsQuery = useQuery({
    queryKey: ['getProductForCurrentUser'],
    queryFn: () => productApi.getProducts({ userId: user.uid })
  })

  const addProductMutation = useMutation({
    mutationFn: productApi.addProduct,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getProductForCurrentUser'] })
      queryClient.invalidateQueries({ queryKey: ['getDaily'] })
    },
  })

  const updateProductMutation = useMutation({
    mutationFn: productApi.updateProduct,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getProductForCurrentUser'] })
      queryClient.invalidateQueries({ queryKey: ['getDaily'] })
    },
  })

  const deleteProductMutation = useMutation({
    mutationFn: productApi.deleteProduct,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getProductForCurrentUser'] })
      queryClient.invalidateQueries({ queryKey: ['getDaily'] })
    },
  })

  if (!user) {
    return null
  }

  const products: t.Product[] = productsQuery.data || []
  const sortedProducts = products.sort((a, b) => {
    return new Date(a.createdAt as string).getTime() - new Date(b.createdAt as string).getTime();
  });

  return (
    <ProductMenu
      products={sortedProducts}
      onChange={(product: t.Product) => {
        console.log('onChange', );
        updateProductMutation.mutate({
          userId: user.uid,
          updatedProduct: product
        })

      }}
      onDelete={(product: t.Product) => {
        deleteProductMutation.mutate({
          userId: user.uid,
          id: product.id
        })
      }}
      onAdd={() => {
        addProductMutation.mutate({
          userId: user.uid,
          product: createEmptyProduct()
        })
      }}
      isFetching={productsQuery.isFetching}
    />
  )
}

export default Products;

