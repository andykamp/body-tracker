import * as t from '@/diet-server/diet.types'
import React from "react";
import {
  useQueryClient,
} from '@tanstack/react-query'
import { useAuthContext } from "@/auth-client/firebase/Provider";
import { useDailyMutations } from "@/diet-client/daily/daily.mutations";
import DailyItem from "@/diet/components/Daily/DailyItem";
import AskAI from "@/diet/components/AI/Container";

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
    <div className="py-4 flex flex-col">
      <ul className="m-0">
        {dailyItemsList.map((item: t.Item) => (
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
      <AskAI/>
    </div>
  )
}

export default DailyItemList;

