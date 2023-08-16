import * as t from "@/diet-server/diet.types";
import { Checkbox } from "@geist-ui/core";
import { useState } from "react";
import MealList from "./MealList";

export type MealMenuProps = {
  meals: t.Meal[],
  onCreate: () => void,
  onChange: (Meal: t.Meal) => void,
  onDelete: (Meal: t.Meal) => void,
  onRestore: (Meal: t.Meal) => void,
  isFetching: boolean,
}

function MealMenu(props: MealMenuProps) {
  const {
    meals,
    onCreate,
    onChange,
    onDelete,
    onRestore,
    isFetching,
  } = props

  const [showCustomDailyMeals, setShowCustomDailyMeals] = useState(true);
  const [showDeletedMeals, setShowDeletedMeals] = useState(false);

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
        onChange={onChange}
        onDelete={onDelete}
        onRestore={onRestore}
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

