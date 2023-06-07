'use client'
import React from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import dailyApi from "@/diet-server/daily/daily.api"
import { useAuthContext } from "@/auth-client/firebase/auth.context";
import StockSearch from '@/diet/components/StockSearch'
import itemApi from '@/diet-server/item/item.api'
import { ITEM_TYPES } from '@/diet-server/diet.constants'
import { createMeal } from '@/diet/utils/misc'
import { useUserContext } from "@/user-client/Provider";
import ItemWrapper from "@/diet/components/ItemWrapper";

function createDailyMeal() {
  const meal = createMeal()
  return itemApi.createItemObject(meal, ITEM_TYPES.MEAL)
}

function DailyPage() {
  const { user: authUser } = useAuthContext()
  const { user } = useUserContext()

  const queryClient = useQueryClient()
  const todaysDailyKey = React.useMemo(() => dailyApi.getTodaysDailyKey(), [])

  const query = useQuery({
    queryKey: ['getDaily'],
    queryFn: () => authUser ? dailyApi.getDaily({ userId: authUser.uid, dateKey: todaysDailyKey }) : Promise.resolve(null),
    enabled: !!authUser
  })

  const addDailyMutation = useMutation({
    mutationFn: dailyApi.addDailyItem,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getDaily'] })
    },
  })
  const updateDailyMutation = useMutation({
    mutationFn: dailyApi.updateDaily,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getDaily'] })
    },
  })
  const removeDailyItemMutation = useMutation({
    mutationFn: dailyApi.removeDailyItem,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getDaily'] })
    },
  })

  if (!authUser || !user) {
    return null
  }

  const daily = query.data
  const dailyItemsList = daily?.dailyItems ? daily?.dailyItems : []
  const dailyMacros = daily ? dailyApi.calculateDailyMacros(daily) : { calories: 0, proteins: 0 }

  return (
    <div>
      <div>
        <p>Target Calories: {user.targetCalories}</p>
        <p>Target Proteins: {user.targetProteins}</p>
        <p>Remaining Calories: {user.targetCalories - dailyMacros.calories}</p>
        <p>Remaining Proteins: {user.targetProteins - dailyMacros.proteins}</p>
        <p className="text-red-500">Yesterdays diff Calories: {daily?.yesterdaysCaloryDiff}</p>
        <p className="text-red-500">Yersterdays diff Proteins: {daily?.yesterdaysProteinDiff}</p>
      </div>
      <div>
        <StockSearch onSelect={(item) => {
          const newItem = itemApi.createItemObject(item, "product")
          const d = daily || { dailyItems: [] }
          addDailyMutation.mutate({
            userId: authUser?.uid,
            daily: {
              id: daily?.id || todaysDailyKey,
              dailyItems: [
                ...d.dailyItems,
                newItem
              ]
            }
          })
        }}
        />
      </div>
      <div>
        {dailyItemsList.map((item: any) => (
          <ItemWrapper
            key={item.id}
            item={item}
            onItemDelete={(item) => {
              removeDailyItemMutation.mutate({
                userId: authUser?.uid,
                daily: daily as any,
                idToDelete: item.id
              })
            }}

            onItemChange={(i) => {
              console.log('itemchange', i)
              const d = daily || { dailyItems: [] }
              const di = d.dailyItems.map(obj => obj.id === i.id ? i : obj);

              updateDailyMutation.mutate({
                userId: authUser?.uid,
                daily: {
                  id: daily?.id || todaysDailyKey,
                  dailyItems: [
                    ...di
                  ]
                }
              })
            }}
          />
        ))}
      </div>

      {
        query.isFetching ?
          <div>Loading...</div>
          : (
            <button
              onClick={() => {
                const dailyMeal = createDailyMeal();
                const d = daily || { dailyItems: [] }
                const dItems = d.dailyItems || []
                addDailyMutation.mutate({
                  userId: authUser?.uid,
                  daily: {
                    id: daily?.id || todaysDailyKey,
                    dailyItems: [
                      ...dItems,
                      dailyMeal
                    ]
                  }
                })
              }}
            >
              Add daily meal
            </button>
          )
      }
    </div >
  )
}

export default DailyPage;

