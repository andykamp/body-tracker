import { v4 as uuid } from 'uuid';
import * as t from "@/diet-server/diet.types";
import { ITEM_TYPES } from '@/diet-server/diet.constants'
import { getISODate } from "@/diet-server/utils/date.utils";

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
  grams,
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
export function createMealObjectEmpty({
  fromCustomDaily = false
}: CreateMealObjectEmptyInput){
  const meal = createMealObject({
    name: '',
    products: [],
    fromCustomDaily
  })
  return meal
}
