import * as t from "@/diet-server/diet.types";
import MealItem from "./MealItem";

export type MealListProps = {
  meals: t.Meal[],
  onChange: (item: t.Meal) => void,
  onDelete: (item: t.Meal) => void,
  onRestore: (item: t.Meal) => void;
}

function MealList(props: MealListProps) {
  const {
    meals,
    onChange,
    onDelete,
    onRestore,
  } = props

  return (
    <ul>
      {
        meals.map((meal: t.Meal) => (
          <MealItem
            key={meal.id}
            meal={meal}
            onChange={onChange}
            onDelete={onDelete}
            onRestore={onRestore}
          />
        ))
      }
    </ul>
  )
}

export default MealList;

