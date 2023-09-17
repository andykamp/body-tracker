import { useState } from "react";
import { Checkbox } from "@geist-ui/core";
import {
  useQueryClient,
} from '@tanstack/react-query'
import { useAuthContext } from "@/auth-client/firebase/Provider";
import * as t from "@/diet-server/diet.types";
import mealApi from "@/diet-server/meal/meal.api"
import MealList from "@/diet/components/Meal/MealList";
import { useMealMutations } from "@/diet-client/meal/meals.mutations";

export type MealMenuProps = {
  meals: t.Meal[],
  isFetching: boolean,
}

function MealMenu(props: MealMenuProps) {
  const {
    meals,
    isFetching,
  } = props

  const { user } = useAuthContext()

  const queryClient = useQueryClient()

  const [showCustomDailyMeals, setShowCustomDailyMeals] = useState(true);
  const [showDeletedMeals, setShowDeletedMeals] = useState(false);

  const {
    addMealMutation,
  } = useMealMutations({ queryClient })

  const onCreate = () => {
    addMealMutation.mutate({
      userId: user?.uid,
      meal: mealApi.createMealObjectEmpty()
    })
  }


  let filteredMeals = showCustomDailyMeals ? meals : meals.filter((meal) => !meal.fromCustomDaily)
  filteredMeals = showDeletedMeals ? filteredMeals : filteredMeals.filter((meal) => !meal.isDeleted)
  const sortedMeals = filteredMeals.sort((a, b) => {
    return new Date(a.createdAt as string).getTime() - new Date(b.createdAt as string).getTime();
  });

  return (
    <div className="">
      <div className="flex flex-col">
        <Checkbox
          checked={showCustomDailyMeals}
          onChange={(e) => setShowCustomDailyMeals(e.target.checked)}
        >
          Show meals created in daily
        </Checkbox>

        <Checkbox
          checked={showDeletedMeals}
          onChange={(e) => setShowDeletedMeals(e.target.checked)}
        >
          Show deleted meals
        </Checkbox>
      </div>

      <MealList
        meals={sortedMeals}
      />

      {isFetching ?
        <div>Loading...</div>
        :
        (<button
          onClick={onCreate}
        >
          Add meal
        </button>
        )
      }

    </div >
  )
}

export default MealMenu;

