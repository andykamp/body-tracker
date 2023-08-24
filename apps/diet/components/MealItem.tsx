import React from "react";
import * as t from '@/diet-server/diet.types'
import { Input } from "@geist-ui/core";
import MealItemList from "./MealItemList";

type MealItemProps = {
  meal: t.Meal;
  onChange: (meal: t.Meal) => void;
  onDelete: (meal: t.Meal) => void;
  onRestore: (meal: t.Meal) => void,
};

function MealItem({
  meal,
  onChange,
  onDelete,
  onRestore
}: MealItemProps) {


  const updateField = (key: string, value: any) => {
    onChange({ ...meal, [key]: value })
  }

  const onMealItemChanged = (meal: t.Meal) => {
    console.log('onMealItemChanged', meal)
    // update the meal
    onChange(meal)
  }

  console.log('mmmmmmmmmmmmm',meal );
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
          label="protein"
          disabled={true}
        />

        <Input
          width="130px"
          value={meal.calories?.toFixed(0).toString()}
          label="calories"
          disabled={true}
        />

        <Input
          width="130px"
          value={meal.grams?.toFixed(0).toString()}
          label="grams"
          disabled={true}
        />

        {onDelete && !isDeleted &&
          <button
            onClick={() => onDelete(meal)}
          >
            delete
          </button>
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
        onMealItemChanged={onMealItemChanged}
      />


    </div>
  );

};
export default MealItem;
