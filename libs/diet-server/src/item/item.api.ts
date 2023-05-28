import * as t from '@/diet-server/diet.types'
import { v4 as uuid } from 'uuid';
import { getISODate } from "@/diet-server/utils/date.utils";


function createItemObject(item: t.Meal | t.Product, type: t.ItemType): t.Item {
  return {
    id: uuid(),
    name: item.name,
    description: item.description,
    createdAt: getISODate(),
    prosentage: 1,
    itemId: item.name,
    itemType: type,
    item: item
  }
}

type GetItemInput = {
  meals: t.Meal[],
  products: t.Product[],
  stockItems: t.StockStateNormalized<t.StockItem>,
}

// @todo rename to someting more descriptive
export async function getOriginalFromItem(item: t.Item, input: GetItemInput): Promise<t.Product | t.Meal> {
  // Returns item.item if item is not null or undefined
  if (item && item.item) {
    return item.item;
  }

  // Check the itemType and tries to find the itemId either in the meals, products, stockMeals, stockProducts
  // by matching the itemId to the id or name parameter
  let matchedItem: t.Product | t.Meal | undefined;

  if (item.itemType === "meal") {
    matchedItem = input.meals.find(meal => meal.name === item.itemId) ||
      input.stockItems.byIds[item.itemId];
  } else if (item.itemType === "product") {
    matchedItem = input.products.find(product => product.name === item.itemId) ||
      input.stockItems.byIds[item.itemId];
  }

  // If no match is found, throws an error "Could not find item in meals or products"
  if (!matchedItem) {
    throw new Error('Could not find item in meals or products');
  }

  return matchedItem;
}

const itemApi ={
  createItemObject,
  getOriginalFromItem
}

export type ItemApi = typeof itemApi;
export default itemApi
