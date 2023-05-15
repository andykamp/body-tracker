import type * as t from "@/diet-server/diet.types"
import { mergeNormalizedStates } from '@/diet-server/stock/stock.utils'
import { STOCK_MEALS, } from "@/diet-server/stock/stock.meals"
import { STOCK_PRODUCTS } from "@/diet-server/stock/stock.products"

export const STOCK_TYPE: Record<string, t.StockType> = {
  product: "product",
  meal: "meal",
  both: "both"
}
export const STOCK_ITEMS_BY_TYPE = {
  product: STOCK_PRODUCTS,
  meal: STOCK_MEALS,
  both: mergeNormalizedStates(STOCK_PRODUCTS, STOCK_MEALS)
}
