import React from "react";
import {
  useQueryClient,
} from '@tanstack/react-query'
import { Input } from "@geist-ui/core";
import * as t from '@/diet-server/diet.types'
import MealItemList from "@/diet/components/Meal/MealItemList";
import { useAuthContext } from "@/auth-client/firebase/Provider";
import { useMealMutations } from "@/diet-client/meal/meals.mutations";
import ConfirmDeleteMeal from "@/diet/components/Confirm/ConfirmDeleteMeal";

type MealItemProps = {
  meal: t.Meal;
};

function MealItem({
  meal,
}: MealItemProps) {

  const { user } = useAuthContext()

  const queryClient = useQueryClient()

  const {
    updateMealMutation,
    deleteMealMutation,
    restoreDeletedMealMutation
  } = useMealMutations({ queryClient })

  const onChange = (meal: t.Meal) => {
    // @todo:also update daily mutatoin if in daily. add a onChange prop to handle such cases
    updateMealMutation.mutate({
      userId: user?.uid,
      meal
    })
  }
  const onDelete = (meal: t.Meal) => {
    deleteMealMutation.mutate({
      userId: user?.uid,
      meal
    })
  }
  const onRestore = (meal: t.Meal) => {
    restoreDeletedMealMutation.mutate({
      userId: user?.uid,
      meal
    })
  }

  const updateField = (key: string, value: any) => {
    onChange({ ...meal, [key]: value })
  }

  const isDeleted = meal.isDeleted

  return (
    <div>
      <div
        key={meal.id}
        className="flex space-x-2 items-center">

        <Input
          width="130px"
          value={meal.name}
          placeholder="New meal..."
          onChange={(e) => updateField('name', e.target.value)}
        />


        <Input
          width="130px"
          value={meal.protein?.toFixed(0).toString()}
          label="p"
          disabled={true}
        />

        <Input
          width="130px"
          value={meal.calories?.toFixed(0).toString()}
          label="c"
          disabled={true}
        />

        <Input
          width="130px"
          value={meal.grams?.toFixed(0).toString()}
          label="g"
          disabled={true}
        />

        {onDelete && !isDeleted &&
          <ConfirmDeleteMeal
            meal={meal}
            onDelete={onDelete}
          />
        }
        {onRestore && isDeleted &&
          <button
            onClick={() => onRestore?.(meal)}
          >
            restore
          </button>
        }
      </div>

      <MealItemList
        meal={meal}
      />


    </div>
  );

};
export default MealItem;
