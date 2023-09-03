import React from "react";
import * as t from '@/diet-server/diet.types'
import { useAuthContext }
  from "@/auth-client/firebase/Provider";
import { useQueryClient }
  from '@tanstack/react-query'
import { useDailyMutations }
  from "@/diet-client/daily/daily.mutations";
import {
  getUpdatedItem,
  onItemSearch,
  onItemSelect,
  updateItemIsLocked
} from "@/diet-server/utils/common.utils";
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

  const onFieldChange = (key: string, value: string) => {
    const newItem = getUpdatedItem({
      item,
      key,
      value,
    })
    updateItemMutation.mutate({
      userId: user.uid,
      daily,
      updatedItem: newItem
    })
  }

  const onDelete = (item: t.Item) => {
    deleteItemMutation.mutate({
      userId: user.uid,
      daily,
      item
    })
  }

  const onSearchChange = (searchTerm: string) => {
    onItemSearch({
      item,
      searchTerm,
      convertToCustomItem: (item: t.Item) =>
        convertItemToCustomItemMutation.mutate({
          userId: user.uid,
          daily,
          item,
          adjustedAttributes: { name: searchTerm }
        }),
      updateNameField: (name: string) => onFieldChange('name', name)
    })
  }

  const onSearchSelect = (selected: t.Product | t.Meal) => {
    onItemSelect({
      item,
      selected,
      convertToStockItem: (selected: t.Product | t.Meal) =>
        convertCustomItemToItemMutation.mutate({
          userId: user.uid,
          daily,
          oldItem: item,
          newProductOrMeal: selected
        }),
      updateItem: (newItem: t.Item) =>
        updateItemMutation.mutate({
          userId: user.uid,
          daily,
          updatedItem: newItem
        })
    })
  }

  const onLock = (newIsLocked: boolean) => {
    updateItemIsLocked({
      item,
      newIsLocked,
      convertToCustomItem: (newItem: t.Item) =>
        convertItemToCustomItemMutation.mutate({
          userId: user.uid,
          daily,
          item: newItem,
        }),
      updateItem: (newItem: t.Item) =>
        updateItemMutation.mutate({
          userId: user.uid,
          daily,
          updatedItem: newItem
        })
    })
  }

  return (
    <Item
      item={item}
      onSearchChange={onSearchChange}
      onSearchSelect={onSearchSelect}
      onFieldChange={onFieldChange}
      onLock={onLock}
      onDelete={onDelete}
    />
  );
};

export default DailyItem;
