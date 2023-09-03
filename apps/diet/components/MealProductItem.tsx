import React from "react";
import * as t from '@/diet-server/diet.types'
import itemApi from "@/diet-server/item/item.api";
import { useAuthContext } from "@/auth-client/firebase/Provider";
import {
  useQueryClient,
} from '@tanstack/react-query'
import { useMealMutations } from "@/diet-client/meal/meals.mutations";
import Item from "./Item";
import { getUpdatedItem, onItemSelect, updateItemIsLocked } from "@/diet-server/utils/common.utils";

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

  const isCustom = item.updateOriginalItem

  const onUpdate = (newItem: t.Item) => {
    updateProductMutation.mutate({
      userId: user.uid,
      meal,
      updatedItem: newItem
    })
  }

  const updateField = (key: string, value: any) => {
    const newItem = getUpdatedItem({
      item,
      key,
      value,
    })
    onUpdate(newItem)
  }

  const updateNumericField = (key: string, value: any) => {
    value = +value
    updateField(key, value)
  }

  const onDelete = (item: t.Item) => {
    deleteProductMutation.mutate({
      userId: user.uid,
      meal,
      item
    })
  }

  const onSearchChange = (searchTerm: string) => {
    console.log('searchTerm', searchTerm);
    if (isCustom) {
      console.log('updatefieldname',);
      updateField('name', searchTerm)
    } else {
      console.log('SEARCH_CONVERT',);
      convertItemToCustomProductMutation.mutate({
        userId: user.uid,
        meal,
        item,
        adjustedAttributes: { name: searchTerm }
      })
    }
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

  const onProsentageChange = (prosentage: number) => {
    const newItem = { ...item, prosentage }
    onUpdate(newItem)
  }

  const onLock = (newIsLocked: boolean) => {
    updateItemIsLocked({
      item,
      newIsLocked,
      updateItem: onUpdate,
      convertToCustomItem: (newItem: t.Item) =>
        convertItemToCustomProductMutation.mutate({
          userId: user.uid,
          meal,
          item: newItem,
        })
    })
  }


  return (
    <Item
      item={item}
      searchType="product"
      onSearchChange={onSearchChange}
      onSearchSelect={onSearchSelect}
      updateNumericField={updateNumericField}
      onProsentageChange={onProsentageChange}
      onLock={onLock}
      onDelete={onDelete}
    />
  );

};
export default MealProductItem;
