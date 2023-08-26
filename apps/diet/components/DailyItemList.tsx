import * as t from '@/diet-server/diet.types'
import React from "react";
import {
  useQueryClient,
} from '@tanstack/react-query'
import { useAuthContext } from "@/auth-client/firebase/Provider";
import DailyItem from "@/diet/components/DailyItem";
import { useDailyMutations } from "./daily.mutations";

type DailyItemListProps = {
  daily: t.DailyDiet
}
function DailyItemList({
  daily
}: DailyItemListProps) {
  const { user } = useAuthContext()

  const queryClient = useQueryClient()

  const {
    addDailyProductMutation,
    addDailyMealMutation,
  } = useDailyMutations({ queryClient })

  const onAddProduct = async () => {
    addDailyProductMutation.mutate({
      userId: user.uid,
      daily,
    })
  }

  const onAddMeal = async () => {
    addDailyMealMutation.mutate({
      userId: user.uid,
      daily,
    })
  }

  const dailyItemsList = daily?.dailyItems ? daily?.dailyItems : []

  return (
    <div className="p-4 flex flex-col">
      <ul>
        {dailyItemsList.map((item: any) => (
          <DailyItem
            key={item.id}
            daily={daily}
            item={item}
          />
        ))}
      </ul>

      <button
        onClick={onAddProduct}
      >
        new product
      </button>
      <button
        onClick={onAddMeal}
      >
        new meal
      </button>
    </div>
  )
}

export default DailyItemList;

