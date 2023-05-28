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
};

export function createProductObject({
  name,
  description = "",
  protein = 0,
  calories = 0,
  grams = 0,
}: CreateProductObjectInput): t.Product {
  const product: t.Product = {
    id: uuid(),
    type: ITEM_TYPES.PRODUCT,
    name,
    description,
    protein,
    calories,
    grams,
    createdAt: getISODate(),
    updatedAt: null,
  };

  return product;
}

