import React, { useCallback, useEffect, useRef, useState } from "react";
import * as t from "@/diet-server/diet.types";
import { getStockItems } from "@/diet-server/stock/stock.api";
import { AutoComplete } from "@geist-ui/core";
import { useDebounce } from "@/diet/utils/misc";
import productApi from "@/diet-server/product/product.api"
import { useAuthContext } from "@/auth-client/firebase/Provider";
import mealApi from "@/diet-server/meal/meal.api"
import {
  useQuery,
} from '@tanstack/react-query'
import { makeOptionBySource, getSearchResults } from "./search.utils";

const stockItems = getStockItems({ type: 'both' })

type SearchInputProps = {
  placeholder?: string;
  initialValue?: string;
  onSelect: (item: t.StockItem) => void;
  onInputChange?: (value: string) => void;
  type?: "product" | "meal" | "both";
}

function SearchInput({
  placeholder,
  initialValue = "",
  onSelect,
  onInputChange,
  type = "both"
}: SearchInputProps) {
  const { user } = useAuthContext()

  const [isSearching, setIsSearching] = useState(false);
  const [search, setSearch] = useState<string>(initialValue);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const res = useRef<any>([]);
  const isSelecting = useRef(false);
  const isSet = useRef(false);

  const productsQuery = useQuery({
    queryKey: ['getProductForCurrentUser'],
    queryFn: () => productApi.getProducts({ userId: user.uid })
  })
  const products: t.Product[] = productsQuery.data || []


  // @todo move to a hook
  const mealsQuery = useQuery({
    queryKey: ['getMealsForCurrentUser'],
    queryFn: () => mealApi.getMeals({ userId: user.uid })
  })
  const meals: t.Meal[] = mealsQuery.data || []

  const onSearch = useCallback(async (search: string) => {

    if (search === "") {
      setIsSearching(false)
      return
    }

    const searchOptions = await getSearchResults({
      type,
      search,
      stockItems,
      products,
      meals
    })

    console.log('setting search', searchOptions);
    setSearchResults(searchOptions)
    res.current = searchOptions
    setIsSearching(false)
  }, [products, meals])

  const onSearchDB = useDebounce(onSearch, 500)

  const handleSearchChange = (search: string) => {
    console.log('ssssssssssss', );
    if(!isSet.current) {
      isSet.current = true
      return
    }
    if(!search) return
    console.log('handleSearchChange', search, isSelecting.current, isSet.current);
    if (isSelecting.current) {
      console.log('do nothing', );
      isSelecting.current = false;
    } else {
      onInputChange?.(search)
      if (!search || search === "") return
      onSearchDB(search)
      setIsSearching(true)
      setSearch(search);
    }
  };
  useEffect(() => {
    console.log('value',search );
  },[search]);

  useEffect(() => {

    console.log('initialValue',initialValue );
  },[initialValue]);

  const handleSelect = useCallback((itemId: string) => {
    console.log('itemId', itemId);
    const item = res.current.find((o: any) => o.value === itemId)?.item
    console.log('item', item);
    // let item = getStockItems({ type }).byIds[itemId];
    // if (!item) item = products.find(p => p.id === itemId) as t.StockItem
    // if (!item) item = meals.find(p => p.id === itemId) as t.StockItem

    isSelecting.current = true;
    onSelect(item);
    setSearch(item.name);
  }, [searchResults]);

  const options = searchResults ? searchResults.map(({ value, source, item }) => makeOptionBySource(value, source, item)) : []

  return (
    <div className="flex">

      <AutoComplete
        clearable
        searching={isSearching}
        value={search}
        placeholder={placeholder}
        options={options}
        onSelect={handleSelect}
        onChange={handleSearchChange}
        disableMatchWidth={true}
      />

    </div>
  );
};

export default SearchInput;

