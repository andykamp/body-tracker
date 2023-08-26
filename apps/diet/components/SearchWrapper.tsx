import React, { useCallback } from "react";
import * as t from "@/diet-server/diet.types";
import { SearchInputControlled, type SearchInputControlledProps } from "./Search";
import { getStockItems } from "@/diet-server/stock/stock.api";
import { useAuthContext } from "@/auth-client/firebase/Provider";
import {
  useQuery,
} from '@tanstack/react-query'
import { getSearchResultsOptions } from "./search.utils";
import { mealCacheKeys } from './meals.cache';
import productApi from "@/diet-server/product/product.api"
import { productCacheKeys } from './products.cache';
import mealApi from "@/diet-server/meal/meal.api"

const stockItems = getStockItems({ type: 'both' })

type SearchInputProps = Omit<SearchInputControlledProps, 'onSearch'> & {
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

  const products: t.Product[] = productsQuery.data || []
  const meals: t.Meal[] = mealsQuery.data || []

  const onSearch = useCallback(async (search: string) => {
    const searchOptions = await getSearchResultsOptions({
      type: 'product',
      search,
      stockItems,
      products: type === 'product' || type === 'both' ? products : [],
      meals: type === 'meal' || type === 'both' ? meals : [],
      blacklistedItemsId,
    })
    return searchOptions

  }, [products, meals, type])

  return (
    <SearchInputControlled
      onSearch={onSearch}
      {...divProps}
    />
  );
}
export default SearchInput;
