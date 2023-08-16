import * as t from "@/diet-server/diet.types";
import { getStockSearchResults } from "@/diet-server/stock/stock.api";
import { AutoComplete, Select } from "@geist-ui/core";
import SearchItem from "./SearchItem";
import { parse, _fetch } from "@/common/utils/utils.fetch";

export const makeOptionBySource = (value: string, source: string, item: any) => {
  switch (source) {
    case 'oda':
      return (
        <AutoComplete.Option value={value}>
          <SearchItem
            item={item}
            source={source}
          />
        </AutoComplete.Option>
      )
    case 'stock':
      return (
        <AutoComplete.Option value={value}>
          <SearchItem
            item={item}
            source={source}
          />
        </AutoComplete.Option>
      )
    case 'userproducts':
      return (
        <AutoComplete.Option value={value}>
          <SearchItem
            item={item}
            source={source}
          />

        </AutoComplete.Option>
      )
    case 'usermeals':
      return (
        <AutoComplete.Option value={value}>
          <SearchItem
            item={item}
            source={source}
          />
        </AutoComplete.Option>
      )
    default:
      return (
        <AutoComplete.Option value={value}>
          default
        </AutoComplete.Option>
      )
  }
}

export async function getSearchResultsOda(search: string) {
  // get oda search results
  const odaResults = await _fetch(`/api/searchStockItems?search=${search}`, {
    method: 'GET',
  });
  return await parse(odaResults) as t.Product[]
}

export function parseSearchResultToOptions(searchResults: t.Product[] | t.Meal[], source: string) {
  return searchResults.map((item: any) => {
    return { label: item.name, value: item.id, source, item }
  })
}

type SearchOptions = {
  label: string
  value: string
  source: string
  item: t.Meal | t.Product
}

type GetSearchResultInput = {
  search: string
  stockItems: t.StockStateNormalized<t.StockItem>
  products: t.Product[]
  meals: t.Meal[]
  type?: t.StockType
}

export const getSearchResults = async ({
  search,
  stockItems,
  products,
  meals,
  type = "both",
}: GetSearchResultInput) => {

  // get oda search results
  const searchResultOda = await getSearchResultsOda(search)

  // parse to search optios
  const odaOptions: SearchOptions[] = parseSearchResultToOptions(searchResultOda, 'oda')

  // get stock search results
  const searchResultStock = getStockSearchResults({ type, search })

  const searchStockOptions = searchResultStock.map((itemId: string) => {
    const item = stockItems.byIds[itemId]
    return { label: item.name, value: item.id, source: 'stock', item }
  })

  const searchUserProductOptions = products.map((item: t.Product) => {
    return { label: item.name, value: item.id, source: 'userproducts', item }
  })

  const searchUserMealOptions = meals.map((item: t.Meal) => {
    return { label: item.name, value: item.id, source: 'usermeals', item }
  })

  const allSearchOptions = [
    ...searchStockOptions,
    ...searchUserProductOptions,
    ...searchUserMealOptions,
    ...odaOptions,
  ]

  return allSearchOptions
}
