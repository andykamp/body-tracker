import React from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import dailyApi from "@/diet-server/daily/daily.api"
import { useAuthContext } from "@/auth-client/firebase/Provider";
import Search from '@/diet/components/Search'
import itemApi from '@/diet-server/item/item.api'
import { useUserContext } from "@/user-client/Provider";
import DailyItem from "@/diet/components/DailyItem";

function DailyPage() {
  const { user: authUser } = useAuthContext()
  const { user } = useUserContext()

  const queryClient = useQueryClient()
  const todaysDailyKey = React.useMemo(() => dailyApi.getTodaysDailyKey(), [])

  const query = useQuery({
    queryKey: ['getDaily'],
    queryFn: () => dailyApi.getDaily({ userId: authUser.uid, dateKey: todaysDailyKey })
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

  const daily = query.data
  const dailyItemsList = daily?.dailyItems ? daily?.dailyItems : []
  const dailyMacros = daily ? itemApi.calculateMacros(daily.dailyItems) : { calories: 0, proteins: 0 }

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
        <Search
          placeholder="Search meal/product"
          onSelect={(item) => {
            const newItem = itemApi.createItemWrapper(item, "product")
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
          <DailyItem
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
            // onClick={() => {
            //   const dailyMeal = createDailyMeal();
            //   const d = daily || { dailyItems: [] }
            //   const dItems = d.dailyItems || []
            //   addDailyMutation.mutate({
            //     userId: authUser?.uid,
            //     daily: {
            //       id: daily?.id || todaysDailyKey,
            //       dailyItems: [
            //         ...dItems,
            //         dailyMeal
            //       ]
            //     }
            //   })
            // }}
            >
              Add daily meal
            </button>
          )
      }
    </div >
  )
}

export default DailyPage;

