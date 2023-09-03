import * as t from "@/diet-server/diet.types";
import itemApi, { type GetItemInput } from '@/diet-server/item/item.api'


// @todo: change to use object argument
export async function populateMinimizedItems(
  minimizedItems: t.ItemMinimal[],
  lookup: GetItemInput
) {

  const newItems: t.Item[] = []
  // populate the meal's products with the original product
  for (const itemMinimal of minimizedItems) {
    // we update the item with the original item in case it has changed
    const originalItem = await itemApi.getOriginalFromItem(itemMinimal, lookup)
    if (!originalItem) throw new Error('Could not find meal item. Should display warning: ' + itemMinimal.id);
    itemMinimal.name = originalItem.name
    itemMinimal.description = originalItem.description

    newItems.push({ ...itemMinimal, item: originalItem })
  }
  return newItems
}

type GetUpdatedItemInput = {
  item: t.Item
  key: string
  value: string
}

export function getUpdatedItem(input: GetUpdatedItemInput) {
  const { item, key, value } = input

  // convert string to number if needed
  const convertToNumber = ['grams', 'protein', 'calories', 'prosentage']
  const parsedValue = convertToNumber.includes(key) ? +value : value

  const newItem = { ...item }

  // if the key is prosentage, we only update the item itself
  // and return early
  if (key === 'prosentage') {
    newItem.prosentage = parsedValue as number
    return newItem
  }

  // we update the item with the new name aswell as the original item
  if (key === 'name') {
    newItem.name = parsedValue as string
  }

  // if custom we add the attributes on the custom item also
  const isCustom = item.updateOriginalItem
  if (isCustom) {
    const product = item.item
    const updatedProduct = { ...product, [key]: parsedValue }
    newItem.item = updatedProduct
  }

  return newItem
}

type onItemSearchInput = {
  item: t.Item,
  searchTerm: string,
  convertToCustomItem: (item: t.Item) => void
  updateNameField: (name: any) => void
}

export function onItemSearch(input: onItemSearchInput) {
  const {
    item,
    searchTerm,
    convertToCustomItem,
    updateNameField,
  } = input

  const isCustom = item.updateOriginalItem

  if (isCustom) {
    updateNameField(searchTerm)
  } else {
    console.log('SEARCH_CONVERT',);
    convertToCustomItem(item)
  }
}

type onItemSelectInput = {
  item: t.Item
  selected: t.Product | t.Meal
  convertToStockItem: (selected: t.Product | t.Meal) => void
  updateItem: (newItem: t.Item) => void
}

export function onItemSelect(input: onItemSelectInput) {
  const {
    item,
    selected,
    convertToStockItem,
    updateItem,
  } = input

  const isCustom = item.updateOriginalItem
  const { type } = selected

  // if current item is custom we need to convert it to a non-custom item
  if (isCustom) {
    console.log('SELECT_CUSTOM', selected);
    convertToStockItem(selected)
  }
  // if current item is not custom we simply update the item with new references
  else {
    console.log('SELECT NOT CUSTOM', selected);
    // create a new wrapper item
    const newItem = itemApi.createItemWrapper(selected, type)
    updateItem(newItem)
  }
}

type LockItemInput = {
  item: t.Item;
  newIsLocked: boolean;
  convertToCustomItem: (newItem: t.Item) => void;
  updateItem: (newItem: t.Item) => void;
}

export function updateItemIsLocked(input: LockItemInput) {
  const {
    item,
    newIsLocked,
    convertToCustomItem,
    updateItem,
  } = input
  const isCustom = item.updateOriginalItem

  const newItem = { ...item, isLocked: newIsLocked }

  // on locking, we only update the isLocked field
  if (newIsLocked) {
    updateItem(newItem)
  }
  // on un-locking, we need to update the actual item with the ration
  else {
    newItem.prosentage = 1
    newItem.item.protein = Math.round((newItem.item.protein || 0) * item.prosentage)
    newItem.item.calories = Math.round((newItem.item.calories || 0) * item.prosentage)
    newItem.item.grams = Math.round((newItem.item.grams || 0) * item.prosentage)

    if (isCustom) {
      updateItem(newItem)
    } else {
      // unlocking means we have to create a new custom item
      convertToCustomItem(newItem)
    }
  }
}

// try to re-use convertCustomProductToItem and convertItemToCustomProduct
// get a standard type of naming on stuff that (ask gpt):
// - updates a object
// - updates a object by creating a new object with updated properties
// - does a action





