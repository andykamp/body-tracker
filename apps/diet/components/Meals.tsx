import * as t from "@/diet-server/diet.types";
import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useAuthContext } from "@/auth-client/firebase/Provider";
import mealApi from "@/diet-server/meal/meal.api"
import { useMealMutations } from "./meals.mutations";
import MealMenu from "./MealMenu";

function Meals() {
  const { user } = useAuthContext()

  const queryClient = useQueryClient()

  const mealsQuery = useQuery({
    queryKey: ['getMealsForCurrentUser'],
    queryFn: () => mealApi.getMeals({ userId: user.uid })
  })

  const {
    addMealMutation,
    updateMealMutation,
    deleteMealMutation,
  } = useMealMutations({ queryClient })

  if (!user) {
    return null
  }

  const meals: t.Meal[] = mealsQuery.data || []

  return (
    <div className="">
      <MealMenu
        meals={meals}
        onCreate={() => {
          addMealMutation.mutate({
            userId: user?.uid,
            meal: mealApi.createMealObjectEmpty()
          })
        }}
        onChange={(meal: t.Meal) => {
          updateMealMutation.mutate({
            userId: user?.uid,
            meal
          })

        }}
        onDelete={(meal: t.Meal) => {
          deleteMealMutation.mutate({
            userId: user?.uid,
            meal
          })
        }}
        onRestore={(meal: t.Meal) => {
        }}
        isFetching={mealsQuery.isFetching}
      />
    </div >
  )
}

export default Meals;

