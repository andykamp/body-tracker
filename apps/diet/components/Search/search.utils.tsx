import * as t from "@/diet-server/diet.types";
import { getStockSearchResults } from "@/diet-server/stock/stock.api";
import { AutoComplete } from "@geist-ui/core";
import SearchItem from "@/diet/components/Search/SearchItem";
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


type SearchOptions = {
  label: string
  value: string
  source: string
  item: t.Meal | t.Product
}

export function parseSearchResultToOptions(searchResults: t.Product[] | t.Meal[], source: string) {
  return searchResults.map((item: t.Product | t.Meal) => {
    return { label: item.name, value: item.id, source, item } as SearchOptions
  }) as SearchOptions[]
}

// foodtable
export async function getSearchResultsFoodtable(search: string) {
  // get oda search results
  const foodtableResults = await _fetch(`/api/searchStockItemsFoodtable?search=${search}`, {
    method: 'GET',
  });
  return await parse(foodtableResults) as t.Product[]
}

export async function getSearchResultsOptionsFoodtable(search: string) {
  // get oda search results
  const searchResult = await getSearchResultsFoodtable(search)

  // parse to search optios
  return parseSearchResultToOptions(searchResult, 'oda')
}


// oda

export async function getSearchResultsOda(search: string) {
  // get oda search results
  const odaResults = await _fetch(`/api/searchStockItemsOda?search=${search}`, {
    method: 'GET',
  });
  return await parse(odaResults) as t.Product[]
}

export async function getSearchResultsOptionsOda(search: string) {
  // get oda search results
  const searchResult = await getSearchResultsOda(search)

  // parse to search optios
  return parseSearchResultToOptions(searchResult, 'oda')
}



function getSearchResultsOptionsMeals(search: string, meals: t.Meal[], blacklistedItemsId: string[]) {
  if (!meals) throw new Error('meals not defined')
  // search meals
  const searchResult = meals.filter(i => i.name.includes(search) && !blacklistedItemsId.includes(i.id))

  // parse to search optios
  return parseSearchResultToOptions(searchResult, 'usermeals')
}


function getSearchResultsOptionsProducts(search: string, products: t.Product[], blacklistedItemsId: string[]) {
  if (!products) throw new Error('products not defined')
  // search product
  const searchResult = products.filter(i => i.name.includes(search) && !blacklistedItemsId.includes(i.id))

  // parse to search optios
  return parseSearchResultToOptions(searchResult, 'userproducts')
}

function getSearchResultsOptionsStock(search: string, type: t.StockType, stockItems: t.StockStateNormalized<t.StockItem>) {
  if (!stockItems) throw new Error('stockItems not defined')
  // search meals
  const searchResult = getStockSearchResults({ type, search })

  // parse to search optios
  const options = searchResult.map((itemId: string) => {
    const item = stockItems.byIds[itemId]
    return { label: item.name, value: item.id, source: 'stock', item }
  })
  return options
}

// ------------------------------------

type GetSearchResultInput = {
  search: string
  stockItems: t.StockStateNormalized<t.StockItem>
  products: t.Product[]
  meals: t.Meal[]
  type?: t.StockType
  blacklistedItemsId?: string[]
}

export async function getSearchResultsOptions({
  search,
  stockItems,
  products,
  meals,
  type = "both",
  blacklistedItemsId = []
}: GetSearchResultInput) {


  const foodtableOptions = await getSearchResultsOptionsFoodtable(search)
  const odaOptions = await getSearchResultsOptionsOda(search)
  const stockOptions = getSearchResultsOptionsStock(search, type, stockItems)
  const productOptions = getSearchResultsOptionsProducts(search, products, blacklistedItemsId)
  const mealOptions = getSearchResultsOptionsMeals(search, meals, blacklistedItemsId)

  const allSearchOptions = [
    ...productOptions,
    ...mealOptions,
    ...odaOptions,
    ...foodtableOptions,
    ...stockOptions,
  ]

  return allSearchOptions
}
