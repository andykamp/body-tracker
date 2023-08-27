import React from "react";
import * as t from '@/diet-server/diet.types'
import itemApi from "@/diet-server/item/item.api";
import { useAuthContext } from "@/auth-client/firebase/Provider";
import {
  useQueryClient,
} from '@tanstack/react-query'
import { useMealMutations } from "./meals.mutations";
import Item from "./Item";

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

  const getUpdatedItem = (key: string, value: any) => {
    if (isCustom) {
      const product = item.item
      const updatedProduct = { ...product, [key]: value }
      item.item = updatedProduct
    }
    return { ...item, [key]: value }

  }

  const updateField = (key: string, value: any) => {
    const newItem = getUpdatedItem(key, value)
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
    // toggle to itemwrapper
    // delete the custom product that was created
    if (isCustom) {
      console.log('SELECT_CUSTOM', selectedProduct);

      convertCustomProductToItemMutation.mutate({
        userId: user.uid,
        meal,
        oldItem: item,
        newProduct: selectedProduct

      })
    } else {
      console.log('SELECT NOT CUSTOM', selectedProduct);
      // create a new wrapper item
      const newItem = itemApi.createItemWrapper(selectedProduct, "product")
      // onChange(newItem)
      updateProductMutation.mutate({
        userId: user.uid,
        meal,
        updatedItem: newItem
      })
    }
  }

  return (
    <Item
      item={item}
      searchType="product"
      onSearchChange={onSearchChange}
      onSearchSelect={onSearchSelect}
      updateNumericField={updateNumericField}
      onDelete={onDelete}
    />
  );

};
export default MealProductItem;
