import * as t from "@/diet-server/diet.types";
import { ITEM_TYPES } from "@/diet-server/diet.constants";

export function assertMeal(item: t.Product | t.Meal): item is t.Meal {
  return item.type === ITEM_TYPES.MEAL
}
export function assertProduct(item: t.Product | t.Meal): item is t.Product {
  return item.type === ITEM_TYPES.PRODUCT
}
