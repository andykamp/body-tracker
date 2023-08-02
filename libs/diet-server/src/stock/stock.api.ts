import type * as t from "@/diet-server/diet.types"
import { STOCK_ITEMS_BY_TYPE } from '@/diet-server/stock/stock.constants'


type StockItemExistInput = {
  name: string
  type: t.StockType
}

export function stockItemExistInput({ name, type }: StockItemExistInput): boolean {
  return Boolean(STOCK_ITEMS_BY_TYPE[type].byIds[name])
}

type GetStockItemInput = {
  name: string
  type: t.StockType
}

export function getStockItem({ name, type }: GetStockItemInput): t.StockItem {
  return STOCK_ITEMS_BY_TYPE[type].byIds[name]
}

type GetStockItemsInput = {
  type: t.StockType
}

export function getStockItems({ type }: GetStockItemsInput): t.StockStateNormalized<t.StockItem> {
  return STOCK_ITEMS_BY_TYPE[type]
}

type GetStockSearchResultsInput = {
  type: t.StockType,
  search: string
}

export function getStockSearchResults({ type, search }: GetStockSearchResultsInput): string[] {
  if (search === "") return []
  return STOCK_ITEMS_BY_TYPE[type].allIds.filter(i => {
    const term = STOCK_ITEMS_BY_TYPE[type].byIds[i].name
    return term.toLowerCase().includes(search.toLowerCase())
  })
}

const stockApi = {
  stockItemExistInput,
  getStockItem,
  getStockItems,
  getStockSearchResults
}
export type StockApi = typeof stockApi
export default stockApi
