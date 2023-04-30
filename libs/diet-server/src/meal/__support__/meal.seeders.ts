import * as t from "@/diet-server/diet.types";
import mealApi, { AddMealToUserInput } from "@/diet-server/meal/meal.api";

const { addMeal, addMealToUser, updateMeal, updateMealToUser, deleteMeal, deleteMealToUser } = mealApi;

export function seedMeal(data?: Partial<t.Meal>) {
  return addMeal({
    name: "Meal A",
    products: [],
    protein: 0,
    calories: 0,
    totalGrams: 0,
    ...data,
  });
}

export function seedAddMealToUser(userId: string, data?: Partial<AddMealToUserInput>) {
  return addMealToUser({
    userId,
    name: "Meal B",
    products: [],
    ...data,
  });
}

export function seedUpdateMeal(key: string, data?: Partial<t.Meal>) {
  return updateMeal({
    key,
    newMeal: {
      name: "Updated Meal",
      products: [],
      protein: 0,
      calories: 0,
      totalGrams: 0,
      ...data,
    },
  });
}

export function seedUpdateMealToUser(userId: string, key: string, data?: Partial<t.Meal>) {
  return updateMealToUser(userId, {
    key,
    newMeal: {
      name: "Updated Meal",
      products: [],
      protein: 0,
      calories: 0,
      totalGrams: 0,
      ...data,
    },
  });
}

export function seedDeleteMeal(key: string) {
  return deleteMeal({ key });
}

export function seedDeleteMealToUser(userId: string, key: string) {
  return deleteMealToUser(userId, { key });
}


export default {
  seedMeal,
  seedAddMealToUser,
  seedUpdateMeal,
  seedUpdateMealToUser,
  seedDeleteMeal,
  seedDeleteMealToUser,
};
