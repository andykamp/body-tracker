import { v4 as uuid } from 'uuid';
import * as t from "@/diet-server/diet.types";
import { ITEM_TYPES } from '@/diet-server/diet.constants'
import { getISODate } from "@/diet-server/utils/date.utils";

export type CreateMealObjectInput = {
  name: string;
  description?: string;
  products: string[];
  fromCustomDaily?: boolean;
  protein?: number;
  calories?: number;
  grams?: number;
};

export function createMealObject({
  name,
  description,
  products,
  fromCustomDaily = false,
  protein=0,
  calories=0,
  grams
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

    fromCustomDaily,
    createdAt: getISODate(),
    updatedAt: null,
  };

  return meal;
}

