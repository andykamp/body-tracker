import * as t from "@/diet-server/diet.types";
import MealItem from "@/diet/components/Meal/MealItem";

export type MealListProps = {
  meals: t.Meal[],
}

function MealList(props: MealListProps) {
  const {
    meals,
  } = props

  return (
    <ul>
      {
        meals.map((meal: t.Meal) => (
          <MealItem
            key={meal.id}
            meal={meal}
          />
        ))
      }
    </ul>
  )
}

export default MealList;

