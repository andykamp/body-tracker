import * as t from "@/diet-server/diet.types";
import itemApi, { type GetItemInput } from '@/diet-server/item/item.api'


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

// try to re-use convertCustomProductToItem and convertItemToCustomProduct
// get a standard type of naming on stuff that (ask gpt):
// - updates a object
// - updates a object by creating a new object with updated properties
// - does a action





