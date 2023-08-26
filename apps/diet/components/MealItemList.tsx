import * as t from "@/diet-server/diet.types";
import MealProductItem from "./MealProductItem";
import {
  useQueryClient,
} from '@tanstack/react-query'
import { useAuthContext } from "@/auth-client/firebase/Provider";
import { useMealMutations } from "./meals.mutations";

type MealItemListProps = {
  meal: t.Meal;
}
function MealItemList(props: MealItemListProps) {
  const { meal } = props
  const { user } = useAuthContext()

  const queryClient = useQueryClient()

    const {
    addProductMutation
  } = useMealMutations({ queryClient })

  const onAdd = async () => {
    addProductMutation.mutate({
      userId: user.uid,
      meal: meal,
    })
  }


  const sortedItems = meal.products
  console.log('sortedItem', sortedItems)

  return (
    <div className="p-4 flex flex-col">

      <ul>
        {sortedItems.map((item: t.Item) => (
          <MealProductItem
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

