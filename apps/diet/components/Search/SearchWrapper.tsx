import React, { useCallback } from "react";
import {
  useQuery,
} from '@tanstack/react-query'
import * as t from "@/diet-server/diet.types";
import {
  SearchInputControlled,
  type ShowAllProps,
  type SearchInputControlledProps
} from "@/ui/Search";
import { getStockItems } from "@/diet-server/stock/stock.api";
import { useAuthContext } from "@/auth-client/firebase/Provider";
import { getSearchResultsOptions } from "./search.utils";
import { mealCacheKeys } from '@/diet-client/meal/meals.cache';
import productApi from "@/diet-server/product/product.api"
import { productCacheKeys } from '@/diet-client/product/products.cache';
import mealApi from "@/diet-server/meal/meal.api"
import { makeOptionBySource } from "./search.utils";
import SearchShowAll from "@/diet/components/Search/SearchShowAll";

function showAll(props: ShowAllProps) {
  const { results, onSelect } = props
  return <SearchShowAll
    results={results}
    onSelect={onSelect}
    parseOption={makeOptionBySource}
  />
}

function parseOptions(results: any[]) {
  return results.map(item => makeOptionBySource(item.value, item.source, item.item))
}

const stockItems = getStockItems({ type: 'both' })

type SearchInputProps = Omit<SearchInputControlledProps, 'onSearch' | 'showAll' | 'parseOptions'> & {
  type?: 'product' | 'meal' | 'both'
  blacklistedItemsId?: string[]
}
function SearchInput({
  type = 'both',
  blacklistedItemsId = [],
  ...divProps
}: SearchInputProps) {

  const { user } = useAuthContext()
  const productsQuery = useQuery({
    queryKey: productCacheKeys.getProducts,
    queryFn: () => productApi.getProducts({ userId: user.uid })
  })

  const mealsQuery = useQuery({
    queryKey: mealCacheKeys.getMeals,
    queryFn: () => mealApi.getMeals({ userId: user.uid })
  })

  const onSearch = useCallback(async (search: string) => {
    const products: t.Product[] = productsQuery.data || []
    const meals: t.Meal[] = mealsQuery.data || []

    const searchOptions = await getSearchResultsOptions({
      type: 'product',
      search,
      stockItems,
      products: type === 'product' || type === 'both' ? products : [],
      meals: type === 'meal' || type === 'both' ? meals : [],
      blacklistedItemsId,
    })
    return searchOptions

  }, [
    productsQuery.data,
    mealsQuery.data,
    type,
    blacklistedItemsId,
  ])

  return (
    <SearchInputControlled
      onSearch={onSearch}
      showAll={showAll}
      parseOptions={parseOptions}
      {...divProps}
    />
  );
}
export default SearchInput;
