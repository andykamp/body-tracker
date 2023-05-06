'use client'
import React from "react";
import Page from "@/ui/Page";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import dailyApi from "@/diet-server/daily/daily.api"
import { useAuthContext } from "@/auth-client/firebase/AuthContext";


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
  const queryClient = useQueryClient()
  const todaysDailyKey = React.useMemo(() => dailyApi.getTodaysDailyKey(), [])


  const query = useQuery({
    queryKey: ['getDaily'],
    queryFn: () => dailyApi.getDaily({ userId: user?.uid, dateKey: todaysDailyKey })
  })

  const mutation = useMutation({
    mutationFn: dailyApi.addDailyMeal,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getDaily'] })
    },
  })

  const dailyMeals = query.data?.meals || {}

  return (
    <Page>
      <h1>Daily page!</h1>
      <ul>
        {Object.values(dailyMeals).map((todo: any) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>

      <button
        onClick={() => {
          mutation.mutate({
            userId: "test-user",
            meal: createDailyMeal()
          })
        }}
      >
        Add daily meal
      </button>
    </Page >
  )
}

export default DailyPage;

