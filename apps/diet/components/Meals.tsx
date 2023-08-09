import * as t from "@/diet-server/diet.types";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useAuthContext } from "@/auth-client/firebase/Provider";
import mealApi from "@/diet-server/meal/meal.api"
import MealItem from "./MealItem";
import { createEmptyMeal } from "../utils/misc";

function Meals() {
  const { user } = useAuthContext()

  const queryClient = useQueryClient()

  const mealsQuery = useQuery({
    queryKey: ['getMealsForCurrentUser'],
    queryFn: () => mealApi.getMeals({ userId: user.uid })
  })

  const addMealMutation = useMutation({
    mutationFn: mealApi.addMeal,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getMealsForCurrentUser'] })
      queryClient.invalidateQueries({ queryKey: ['getDaily'] })
    },
  })

  const updateMealMutation = useMutation({
    mutationFn: mealApi.updateMeal,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getMealsForCurrentUser'] })
      queryClient.invalidateQueries({ queryKey: ['getDaily'] })
    },
  })

  const deleteMealMutation = useMutation({
    mutationFn: mealApi.deleteMeal,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getMealsForCurrentUser'] })
      queryClient.invalidateQueries({ queryKey: ['getDaily'] })
    },
  })

  if (!user) {
    return null
  }

  const meals: t.Meal[] = mealsQuery.data || []
  console.log('mmmmmmm', meals);


  return (
    <div className="">

      <ul>
        {meals.map((meal: t.Meal) => (
          <MealItem
            key={meal.id}
            meal={meal}
            onChange={(meal: t.Meal) => {
              updateMealMutation.mutate({
                userId: user?.uid,
                meal
              })

            }}
            onDelete={(meal: t.Meal) => {
              deleteMealMutation.mutate({
                userId: user?.uid,
                id: meal.id
              })
            }}
          />
        ))}
      </ul>

      {mealsQuery.isFetching ?
        <div>Loading...</div>
        :
        (<button
          onClick={() => {
            const meal = createEmptyMeal()
            addMealMutation.mutate({
              userId: user?.uid,
              meal
            })
          }}
        >
          Add meal
        </button>
        )
      }

    </div >
  )
}

export default Meals;

