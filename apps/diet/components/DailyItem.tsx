import React from "react";
import * as t from '@/diet-server/diet.types'
import itemApi from "@/diet-server/item/item.api";
import { useAuthContext } from "@/auth-client/firebase/Provider";
import {
  useQueryClient,
} from '@tanstack/react-query'
import { useDailyMutations } from "./daily.mutations";
import Item from "./Item";

type DailyItemProps = {
  daily: t.DailyDiet;
  item: t.Item;
};

function DailyItem({
  daily,
  item,
}: DailyItemProps) {
  const { user } = useAuthContext()

  const queryClient = useQueryClient()

  const {
    updateItemMutation,
    deleteItemMutation,
    convertCustomItemToItemMutation,
    convertItemToCustomItemMutation,
  } = useDailyMutations({ queryClient })

  const isCustom = item.updateOriginalItem

  const onUpdate = (newItem: t.Item) => {
    console.log('onUpdtae',newItem.name );
    updateItemMutation.mutate({
      userId: user.uid,
      daily,
      updatedItem: newItem
    })
  }

  const getUpdatedItem = (key: string, value: any) => {
    if (isCustom) {
      const i = item.item
      const updated = { ...i, [key]: value }
      item.item = updated
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
      deleteItemMutation.mutate({
        userId: user.uid,
        daily,
        item
      })
  }

  const onSearchChange = (searchTerm: string) => {
    console.log('searchTerm', searchTerm);
    if (isCustom) {
      updateField('name', searchTerm)
    } else {
      console.log('SEARCH_CONVERT',);
      convertItemToCustomItemMutation.mutate({
        userId: user.uid,
        daily,
        item,
        adjustedAttributes: { name: searchTerm }
      })
    }
  }

  const onSearchSelect = (selected: t.Product) => {
    const { type } = selected
    // toggle to itemwrapper
    // delete the custom product that was created
    if (isCustom) {
      console.log('SELECT_CUSTOM', selected);
      convertCustomItemToItemMutation.mutate({
        userId: user.uid,
        daily,
        oldItem: item,
        newProductOrMeal: selected
      })
    } else {
      console.log('SELECT NOT CUSTOM', selected);
      // create a new wrapper item
      const newItem = itemApi.createItemWrapper(selected, type)
      updateItemMutation.mutate({
        userId: user.uid,
        daily,
        updatedItem: newItem
      })
    }
  }

  return (
    <Item
      item={item}
      onSearchChange={onSearchChange}
      onSearchSelect={onSearchSelect}
      updateNumericField={updateNumericField}
      onDelete={onDelete}
    />
  );
};

export default DailyItem;
