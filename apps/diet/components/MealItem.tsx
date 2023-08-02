import React, { useState, useEffect } from "react";
import * as t from '@/diet-server/diet.types'
import { Input } from "@geist-ui/core";
import MealItemList from "./MealItemList";

type MealItemProps = {
  meal: t.Meal;
  onChange: (meal: t.Meal) => void;
  onDelete: (meal: t.Meal) => void;
};

function MealItem({
  meal,
  onChange,
  onDelete,
}: MealItemProps) {


  const updateField = (key: string, value: any) => {
    onMealChange({ ...meal, [key]: value })
  }

  const onMealChange = (meal: t.Meal) => {
    console.log('onMealChange', meal)
    // update the meal
    onChange(meal)
  }

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
        />

        <Input
          width="130px"
          value={meal.calories?.toFixed(0).toString()}
          label="calories"
        />

        <Input
          width="130px"
          value={meal.grams?.toFixed(0).toString()}
          label="grams"
        />

        <button
          onClick={() => onDelete(meal)}
        >
          delete
        </button>
      </div>

      <MealItemList
        meal={meal}
        onMealChange={onMealChange}
      />


    </div>
  );

};
export default MealItem;
