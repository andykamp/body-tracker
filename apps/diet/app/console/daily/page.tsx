'use client'
import React from "react";
import Page from "@/ui/Page";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import dailyApi from "@/diet-server/daily/daily.api"
import { useAuthContext } from "@/auth-client/firebase/auth.context";
import StockSearch from '@/diet/components/StockSearch'

function createDailyMeal() {
  return {
    name: `test_meal_${Math.random()}`,
    products: ["SmallMealsCottageCheeseWithPB"],
    protein: Math.floor(Math.random() * 201),
    calories: Math.floor(Math.random() * 201),
  }
}

function DailyPage() {
  const { user } = useAuthContext()
  if (!user) {
    throw new Error("User is undefined");
  }
  const queryClient = useQueryClient()
  const todaysDailyKey = React.useMemo(() => dailyApi.getTodaysDailyKey(), [])


  const query = useQuery({
    queryKey: ['getDaily'],
    queryFn: () => dailyApi.getDaily({ userId: user.uid, dateKey: todaysDailyKey })
  })

  const addDailyMutation = useMutation({
    mutationFn: dailyApi.addDailyMeal,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getDaily'] })
    },
  })
  const removeDailyMealMutation = useMutation({
    mutationFn: dailyApi.removeDailyMeal,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getDaily'] })
    },
  })

  const daily = query.data
  const dailyMealList = daily?.meals ? Object.values(daily?.meals) : []

  return (
    <Page>
      <h1>Daily page!</h1>
      <div>
        <StockSearch onSelect={(e) => console.log('onSelect', e)} />
      </div>
      <ul>
        {dailyMealList.map((meal: any) => (
          <li key={meal.name}>{meal.name}
            <button
              onClick={() => {
                removeDailyMealMutation.mutate({
                  userId: user?.uid,
                  daily: daily as any,
                  mealName: meal.name
                })
              }}
            >
              delete
            </button>
          </li>
        ))}
      </ul>

      {query.isFetching ?
        <div>Loading...</div>
        : (
          <button
            onClick={() => {
              const dailyMeal = createDailyMeal();
              addDailyMutation.mutate({
                userId: user?.uid,
                daily: {
                  ...daily,
                  meals: {
                    ...daily?.meals,
                    [dailyMeal.name]: dailyMeal
                  }
                }
              })
            }}
          >
            Add daily meal
          </button>
        )}
    </Page >
  )
}

export default DailyPage;

