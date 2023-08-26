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
    addDailyItemMutation,
  } = useDailyMutations({ queryClient })

  const onAdd = async () => {
    addDailyItemMutation.mutate({
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
        onClick={onAdd}
      >
        new product
      </button>
    </div>
  )
}

export default DailyItemList;

