import * as t from "@/diet-server/diet.types";
import { createEmptyProduct } from "../utils/misc";
import itemApi from "@/diet-server/item/item.api";
import mealApi from "@/diet-server/meal/meal.api"
import Item from "./Item";
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useAuthContext } from "@/auth-client/firebase/Provider";
import productApi from "@/diet-server/product/product.api"

type MealItemListProps = {
  meal: t.Meal;
  onMealChange: (meal: t.Meal) => void;
}
function MealItemList(props: MealItemListProps) {
  const { meal, onMealChange } = props
  const { user } = useAuthContext()

  const queryClient = useQueryClient()

  // @todo: do i need to use cache here?
  const addProductMutation = useMutation({
    mutationFn: productApi.addProduct,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getProductForCurrentUser'] })
      queryClient.invalidateQueries({ queryKey: ['getDaily'] })
    },
  })

  const updateMeal = (meal: t.Meal) => {
    const macros =  mealApi.getMacros(meal)
    const newMeal = {...meal, ...macros}
    onMealChange(newMeal)
  }

  const onAdd = async () => {
    // create a ewn product
    const newProduct = createEmptyProduct(true)

    // store product
    // addProductMutation.mutate({
    //   userId: user.uid,
    //   product: newProduct
    // })
    await productApi.addProduct({
      userId: user.uid,
      product: newProduct
    })

    // crate a item around it
    const newItem = itemApi.createItemWrapper(newProduct, "product")
    newItem.updateOriginalItem = true

    // update the meal
    updateMeal({ ...meal, products: [...meal.products, newItem] })
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
            key={item.id}
            item={item}
            onChange={onItemChange}
            onDelete={onItemDelete}
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
