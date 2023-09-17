import React, { useCallback } from "react";
import { useQueryClient }
  from '@tanstack/react-query'
import { useAuthContext }
  from "@/auth-client/firebase/Provider";
import * as t from '@/diet-server/diet.types'
import {
  getUpdatedItem,
  onItemSearch,
  onItemSelect,
  updateItemIsLocked
} from "@/diet-server/utils/common.utils";
import { useMealMutations }
  from "@/diet-client/meal/meals.mutations";
import Item from "../Item";

type MealProductItem = {
  meal: t.Meal;
  item: t.Item;
};

function MealProductItem({
  meal,
  item,
}: MealProductItem) {
  const { user } = useAuthContext()

  const queryClient = useQueryClient()

  const {
    updateProductMutation,
    deleteProductMutation,
    convertCustomProductToItemMutation,
    convertItemToCustomProductMutation,
  } = useMealMutations({ queryClient })

  const onFieldChange = useCallback((key: string, value: string) => {
    const newItem = getUpdatedItem({
      item,
      key,
      value,
    })
    updateProductMutation.mutate({
      userId: user.uid,
      meal,
      updatedItem: newItem
    })
  }, [
    updateProductMutation,
    meal,
    item,
    user.uid
  ])

  const onDelete = (item: t.Item) => {
    deleteProductMutation.mutate({
      userId: user.uid,
      meal,
      item
    })
  }

  const onSearchChange = (searchTerm: string) => {
    console.log('searchTerm', searchTerm);
    onItemSearch({
      item,
      searchTerm,
      convertToCustomItem: (item: t.Item) =>
        convertItemToCustomProductMutation.mutate({
          userId: user.uid,
          meal,
          item,
          adjustedAttributes: { name: searchTerm }
        }),
      updateNameField: (name: string) => onFieldChange('name', name)
    })
  }

  const onSearchSelect = (selectedProduct: t.Product) => {
    onItemSelect({
      item,
      selected: selectedProduct,
      convertToStockItem: (selected: t.Product) =>
        convertCustomProductToItemMutation.mutate({
          userId: user.uid,
          meal,
          oldItem: item,
          newProduct: selected
        }),
      updateItem: (newItem: t.Item) =>
        updateProductMutation.mutate({
          userId: user.uid,
          meal,
          updatedItem: newItem
        })
    })
  }

  const onLock = (newIsLocked: boolean) => {
    updateItemIsLocked({
      item,
      newIsLocked,
      convertToCustomItem: (newItem: t.Item) =>
        convertItemToCustomProductMutation.mutate({
          userId: user.uid,
          meal,
          item: newItem,
        }),
      updateItem: (newItem: t.Item) =>
        updateProductMutation.mutate({
          userId: user.uid,
          meal,
          updatedItem: newItem
        }),
    })
  }

  return (
    <Item
      item={item}
      searchType="product"
      onSearchChange={onSearchChange}
      onSearchSelect={onSearchSelect}
      onFieldChange={onFieldChange}
      onLock={onLock}
      onDelete={onDelete}
    />
  );

};
export default MealProductItem;
