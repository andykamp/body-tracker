import {
  useQuery,
} from '@tanstack/react-query'
import { useAuthContext } from "@/auth-client/firebase/Provider";
import * as t from "@/diet-server/diet.types";
import mealApi from "@/diet-server/meal/meal.api"
import { mealCacheKeys } from '@/diet-client/meal/meals.cache';
import MealMenu from "@/diet/components/Meal/MealMenu";

function Meals() {
  const { user } = useAuthContext()

  const mealsQuery = useQuery({
    queryKey: mealCacheKeys.getMeals,
    queryFn: () => mealApi.getMeals({ userId: user.uid })
  })


  const meals: t.Meal[] = mealsQuery.data || []

  return (
    <div className="">
      <MealMenu
        meals={meals}
        isFetching={mealsQuery.isFetching}
      />
    </div >
  )
}

export default Meals;

