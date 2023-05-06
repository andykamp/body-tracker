'use client'
import React from "react";
import Page from "@/ui/Page";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useAuthContext } from "@/auth-client/firebase/AuthContext";
import mealApi from "@/diet-server/meal/meal.api"
import productApi from "@/diet-server/product/product.api"

function createProduct() {
  return {
    name: `test_meal_${Math.random()}`,
    protein: Math.floor(Math.random() * 201),
    calories: Math.floor(Math.random() * 201),
  }
}

function MealsAndProductsPage() {
  const { user } = useAuthContext()
  const queryClient = useQueryClient()


  const productsQuery = useQuery({
    queryKey: ['getMealsForCurrentUser'],
    queryFn: () => productApi.getProductsToUser({ userId: user?.uid })
  })

  const mealsQuery = useQuery({
    queryKey: ['getMealsForCurrentUser'],
    queryFn: () => mealApi.getMealsToUser({ userId: user?.uid })
  })

  const addProductMutation = useMutation({
    mutationFn: productApi.addProductToUser,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getDaily'] })
    },
  })
  const addMealMutation = useMutation({
    mutationFn: mealApi.addMealToUser,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getDaily'] })
    },
  })

  const meals = mealsQuery.data?.meals || {}
  const products = productsQuery.data?.products || {}

  return (
    <Page>
      <h1> meals and products page!</h1>
      <div className="flex">
        <div>

          <ul>
            {Object.values(products).map((todo: any) => (
              <li key={todo.id}>{todo.title}</li>
            ))}
          </ul>

          <button
            onClick={() => {
              addProductMutation.mutate({
                userId: user?.uid,
                product: createProduct()
              })
            }}
          >
            Add product
          </button>
        </div>
        <div>
          <div className="flex">

            <ul>
              {Object.values(meals).map((todo: any) => (
                <li key={todo.id}>{todo.title}</li>
              ))}
            </ul>

            <button
              onClick={() => {
                addMealMutation.mutate({
                  userId: user?.uid,
                  name: `test_meal_${Math.random()}`,
                  products: ["SmallMealsCottageCheeseWithPB"],
                })
              }}
            >
              Add product
            </button>
          </div>
        </div>
      </div>
    </Page >
  )
}

export default MealsAndProductsPage;

