import { v4 as uuid } from 'uuid';
import * as t from "@/diet-server/diet.types";
import { ITEM_TYPES } from '@/diet-server/diet.constants'
import { getISODate } from "@/diet-server/utils/date.utils";
import itemApi, { type GetItemInput } from '@/diet-server/item/item.api'
import { populateMinimizedItems } from '@/diet-server/utils/common.utils'

export type CreateMealObjectInput = {
  name: string;
  description?: string;
  products: t.Item[];
  fromCustomDaily?: boolean;
  protein?: number;
  calories?: number;
  grams?: number;
  isStockItem?: boolean;
};

export function createMealObject({
  name,
  description,
  products,
  fromCustomDaily = false,
  protein = 0,
  calories = 0,
  grams = 0,
  isStockItem = false,
}: CreateMealObjectInput): t.Meal {
  const meal: t.Meal = {
    id: uuid(),
    type: ITEM_TYPES.MEAL,
    name,
    description,

    products,
    protein,
    calories,
    grams,

    isStockItem,
    fromCustomDaily,

    createdAt: getISODate(),
    updatedAt: undefined,
  };

  return meal;
}


type CreateMealObjectEmptyInput = {
  fromCustomDaily?: boolean;
}

export function createMealObjectEmpty(
  props?: CreateMealObjectEmptyInput
) {
  const meal = createMealObject({
    name: '',
    products: [],
    fromCustomDaily: props?.fromCustomDaily || false,
  })
  return meal
}

export function minimizeMeal(
  meal: t.Meal
): t.MealMinimal {

  // extract unused properties
  const { protein, calories, grams, products, ...rest } = meal

  // remove item references
  const productsMinimal: t.ItemMinimal[] = []

  // minimize each item
  products.forEach((i: t.Item) => {
    const { item, ...rest } = i
    productsMinimal.push(rest)
  })

  const mealMinimal: t.MealMinimal = {
    ...rest,
    products: productsMinimal
  }
  return mealMinimal
}

export function getMacros(
  meal: t.Meal
) {
  const macros = itemApi.calculateMacros(meal.products)
  return macros
}

export function updateMacros(
  meal: t.Meal
) {
  const macros = getMacros(meal)
  const newMeal = { ...meal, ...macros }
  return newMeal
}

export function hasReferences(
  meal: t.Meal
) {
  return hasReferenceToDaily(meal)
}

export function hasReferenceToDaily(
  meal: t.Meal
) {
  return meal.referenceDailies && Object.keys(meal.referenceDailies).length > 0
}

export function addReferenceToDaily(
  meal: t.Meal,
  dailyId: string
): t.Meal {
  const newMeal = { ...meal }
  if (!newMeal.referenceDailies) newMeal.referenceDailies = {}
  newMeal.referenceDailies[dailyId] = true
  return newMeal
}

export function removeReferenceToDaily(
  meal: t.Meal,
  dailyId: string
): t.Meal {
  const newMeal = { ...meal }
  if (newMeal.referenceDailies) {
    delete newMeal.referenceDailies[dailyId]
  }
  return newMeal
}
