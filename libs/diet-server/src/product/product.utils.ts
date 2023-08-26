import { v4 as uuid } from 'uuid';
import * as t from "@/diet-server/diet.types";
import { ITEM_TYPES } from '@/diet-server/diet.constants'
import { getISODate } from "@/diet-server/utils/date.utils";

export type CreateProductObjectInput = {
  name: string;
  description?: string;
  protein?: number;
  calories?: number;
  grams?: number;
  isStockItem?: boolean;
  fromCustomMeal?: boolean;
  fromCustomDaily?: boolean;
  referenceMeals?: t.References;
  referenceDailies?: t.References;
};

export function createProductObject({
  name,
  description = "",
  protein = 0,
  calories = 0,
  grams = 0,
  isStockItem = false,
  fromCustomMeal = false,
  fromCustomDaily = false,
  referenceMeals,
  referenceDailies,
}: CreateProductObjectInput): t.Product {
  const product: t.Product = {
    id: uuid(),
    type: ITEM_TYPES.PRODUCT,
    name,
    description,
    protein,
    calories,
    grams,

    isStockItem,
    fromCustomMeal,
    fromCustomDaily,

    createdAt: getISODate(),
    updatedAt: undefined,
    referenceMeals,
    referenceDailies,

  };

  return product;
}

type CreateProductObjectEmptyInput = {
  fromCustomMeal?: boolean;
  fromCustomDaily?: boolean;
}
export function createProductObjectEmpty({
  fromCustomMeal = false,
  fromCustomDaily = false
}: CreateProductObjectEmptyInput) {
  const product = createProductObject({
    name: '',
    fromCustomMeal,
    fromCustomDaily
  })
  return product
}

