'use client'
import React from "react";
import Page from "@/ui/Page";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useAuthContext } from "@/auth-client/firebase/auth.context";
import mealApi from "@/diet-server/meal/meal.api"
import productApi from "@/diet-server/product/product.api"

function createProduct() {
  return {
    name: `test_product_${Math.random()}`,
    protein: Math.floor(Math.random() * 201),
    calories: Math.floor(Math.random() * 201),
  }
}

function MealsAndProductsPage() {
  const { user } = useAuthContext()
  const queryClient = useQueryClient()


  const productsQuery = useQuery({
    queryKey: ['getProductForCurrentUser'],
    queryFn: () => productApi.getProducts({ userId: user?.uid })
  })

  const mealsQuery = useQuery({
    queryKey: ['getMealsForCurrentUser'],
    queryFn: () => mealApi.getMeals({ userId: user?.uid })
  })

  const addProductMutation = useMutation({
    mutationFn: productApi.addProduct,
    onSuccess: () => {
      console.log('addProductMutation success',);
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getProductForCurrentUser'] })
      queryClient.invalidateQueries({ queryKey: ['getDaily'] })
    },
  })

  const deleteProductMutation = useMutation({
    mutationFn: productApi.deleteProduct,
    onSuccess: () => {
      console.log('deleteProductMutation success',);
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getProductForCurrentUser'] })
      queryClient.invalidateQueries({ queryKey: ['getDaily'] })
    },
  })

  const addMealMutation = useMutation({
    mutationFn: mealApi.addMeal,
    onSuccess: () => {
      console.log('addMealMutation success',);
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getMealsForCurrentUser'] })
      queryClient.invalidateQueries({ queryKey: ['getDaily'] })
    },
  })

  const deleteMealMutation = useMutation({
    mutationFn: mealApi.deleteMeal,
    onSuccess: () => {
      console.log('deleteMealMutation success',);
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getMealsForCurrentUser'] })
      queryClient.invalidateQueries({ queryKey: ['getDaily'] })
    },
  })

  const meals = mealsQuery.data
  const mealsList = meals ? Object.values(meals) : []
  const products = productsQuery.data || {}
  const productsList = products ? Object.values(products) : []

  return (
    <Page>
      <h1> meals and products page!</h1>
      <div className="flex">
        <div className="flex flex-col">

          <ul>
            {productsList.map((product: any) => (
              <li key={product.name}>{product.name}
            <button
              onClick={() => {
                deleteProductMutation.mutate({
                  userId: user?.uid,
                  name: product.name
                })
              }}
            >
             delete 
            </button>
              </li>
            ))}
          </ul>

          {productsQuery.isFetching ?
            <div>Loading...</div>
            :
            (<button
              onClick={() => {
                addProductMutation.mutate({
                  userId: user?.uid,
                  product: createProduct()
                })
              }}
            >
              Add product
            </button>
            )}
        </div>

        <div className="flex flex-col">

          <ul>
            {mealsList.map((meal: any) => (
              <li key={meal.name}>{meal.name}
                <button
                  onClick={() => {
                    deleteMealMutation.mutate({
                      userId: user?.uid,
                      name: meal.name
                    })
                  }}
                >
                  delete
                </button>
              </li>
            ))}
          </ul>

          {mealsQuery.isFetching ?
            <div>Loading...</div>
            :
            (<button
              onClick={() => {
                addMealMutation.mutate({
                  userId: user?.uid,
                  name: `test_meal_${Math.random()}`,
                  products: ["CottageCheeseOriginal"],
                })
              }}
            >
              Add meal
            </button>
            )}
        </div>
      </div>
    </Page >
  )
}

export default MealsAndProductsPage;

