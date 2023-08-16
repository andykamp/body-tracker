import * as t from "@/diet-server/diet.types";
import mealApi from "@/diet-server/meal/meal.api"
import Item from "./Item";
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useAuthContext } from "@/auth-client/firebase/Provider";
import { updateCacheOnMutate } from "../utils/caching";
import { useMealMutations } from "./meals.mutations";

type MealItemListProps = {
  meal: t.Meal;
  onMealItemChanged: (meal: t.Meal) => void;
}
function MealItemList(props: MealItemListProps) {
  const { meal, onMealItemChanged } = props
  const { user } = useAuthContext()

  const queryClient = useQueryClient()

    const {
    addProductMutation
  } = useMealMutations({ queryClient })

  const updateMeal = (meal: t.Meal) => {
    const macros = mealApi.getMacros(meal)
    const newMeal = { ...meal, ...macros }
    onMealItemChanged(newMeal)
  }

  const onAdd = async () => {
    addProductMutation.mutate({
      userId: user.uid,
      meal: meal,
    })
  }

  const onItemChange = (item: t.Item) => {
    console.log('onImputchage', item, meal);
    const newMeal = { ...meal }
    newMeal.products = newMeal.products.map(i => i.id === item.id ? item : i);
    updateMeal(newMeal)
  }

  const onItemDelete = (item: t.Item) => {
    const newMeal = { ...meal }
    newMeal.products = newMeal.products.filter(i => i.id !== item.id)
    updateMeal(newMeal)
  }

  const sortedItems = meal.products
  console.log('sortedItem', sortedItems)

  return (
    <div className="p-4 flex flex-col">

      <ul>
        {sortedItems.map((item: t.Item) => (
          <Item
            meal={meal}
            key={item.id}
            item={item}
          />
        ))}
      </ul>

      <button
        onClick={onAdd}
      >
        new product
      </button>

    </div >
  )
}

export default MealItemList;

