import React, { useCallback, useEffect, useState } from "react";
import * as t from "@/diet-server/diet.types";
import { getStockItems, getStockSearchResults } from "@/diet-server/stock/stock.api";
import { AutoComplete, Select } from "@geist-ui/core";
import { useDebounce } from "@/diet/utils/misc";
import productApi from "@/diet-server/product/product.api"
import { useAuthContext } from "@/auth-client/firebase/Provider";
import mealApi from "@/diet-server/meal/meal.api"
import {
  useQuery,
} from '@tanstack/react-query'
import ProductItem from "./ProductItem";
import MealItem from "./MealItem";

type SearchInputProps = {
        placeholder: string;
  initialValue?: string;
  onSelect: (item: t.StockItem) => void;
  onInputChange?: (value: string) => void;
  type?: "product" | "meal" | "both";
}

const SearchInput: React.FC<SearchInputProps> = ({ placeholder, initialValue="", onSelect, onInputChange, type: _type = 'both' }) => {
  const { user } = useAuthContext()

  const [isSearching, setIsSearching] = useState(false);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<"product" | "meal" | "both">(_type);
  const [options, setOptions] = useState<any>([]);

  // const makeOption = (label: string, value: string) => {

  //   const product = getStockItems({ type }).byIds[value] || products.find(p => p.id === value)
  //   if (product) {
  //     return (
  //       <AutoComplete.Option value={value}>
  //         <ProductItem
  //           item={product}
  //           onChange={() => {
  //             console.log('',);
  //           }}
  //           onDelete={() => {
  //             console.log('',);
  //           }}
  //         />
  //       </AutoComplete.Option>
  //     )
  //   }
  //   if (!product) {
  //     const meal = meals.find(p => p.id === value)
  //     if (meal) {
  //       return (
  //         <AutoComplete.Option value={value}>
  //           <MealItem
  //             item={meal}
  //             onChange={() => {
  //               console.log('',);
  //             }}
  //             onDelete={() => {
  //               console.log('',);
  //             }}
  //           />
  //         </AutoComplete.Option>
  //       )
  //     }
  //   }
  //   return (
  //     <AutoComplete.Option value={value}>
  //       {label}
  //     </AutoComplete.Option>
  //   )

  // }

  // @todo move to a hook
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

  const onSearch = useCallback(async (type: t.StockType, search: string) => {

    if (search === "") {
      setOptions([])
      setIsSearching(false)
      return
    }
    const searchResults = getStockSearchResults({ type, search })

    const stockItems = getStockItems({ type })

    const searchStockOptions = searchResults.map((itemId: string) => {
      const item = stockItems.byIds[itemId]
      return { label: item.name, value: item.id }
    })
    const searchUserProductOptions = products.map((item: t.Product) => {
      return { label: item.name, value: item.id }
    })
    const searchUserMealOptions = meals.map((item: t.Meal) => {
      return { label: item.name, value: item.id }
    })

    const searchOptions = [
      ...searchStockOptions,
      ...searchUserProductOptions,
      ...searchUserMealOptions,
    ]
    // const customOptions = searchOptions.map(({ label, value }) => makeOption(label, value))
    setOptions(searchOptions)
    setIsSearching(false)
  }, [products, meals])

  const onSearchDB = useDebounce(onSearch, 500)

  // useEffect(() => {
  //   if (!search || !type) return
  //   else
  //     onSearchDB(type, search)
  // }, [search, type, onSearchDB])

  useEffect(() => {
    if (search === "") setOptions([])
  }, [search])

  const handleSearchChange = (string: string) => {
    onInputChange?.(search)
    if (string === "") return
    onSearchDB(type, search)

    setIsSearching(true)
    setSearch(string);
  };

  // const handleTypeChange = (val: string | string[]) => {
  //   setType(val as typeof type);
  // };

  const handleSelect = (itemId: string) => {
    let item = getStockItems({ type }).byIds[itemId];
    if (!item) item = products.find(p => p.id === itemId) as t.StockItem
    if (!item) item = meals.find(p => p.id === itemId) as t.StockItem
    onSelect(item);
    setSearch("");
  };

  return (
    <div className="flex">

      <AutoComplete
        clearable
        searching={isSearching}
        initialValue={initialValue}
        value={search}
        placeholder={placeholder}
        options={options}
        onSelect={handleSelect}
        onChange={handleSearchChange}
        disableMatchWidth={true}
      />

      {/*
      <Select
        width="100px"
        value={type}
        onChange={handleTypeChange}>
        <Select.Option value="both">Both</Select.Option>
        <Select.Option value="product">Product</Select.Option>
        <Select.Option value="meal">Meal</Select.Option>
      </Select>
      */}

    </div>
  );
};

export default SearchInput;

