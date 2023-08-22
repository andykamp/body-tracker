import * as t from '@/diet-server/diet.types'
import { v4 as uuid } from 'uuid';
import { getISODate } from "@/diet-server/utils/date.utils";
import { parse, _fetch } from "@/common/utils/utils.fetch";


function createItemWrapper(item: t.Meal | t.Product, type: t.ItemType): t.Item {
  return {
    id: uuid(),
    name: item.name,
    description: item.description,
    createdAt: getISODate(),
    prosentage: 1,

    itemId: item.id,
    itemType: type,
    isStockItem: item.isStockItem,
    updateOriginalItem: false,
    item: item
  }
}

export type GetItemInput = {
  meals: t.Meal[],
  products: t.Product[],
  stockItems: t.StockStateNormalized<t.StockItem>,
}

// @todo rename to someting more descriptive
// @todo: add a isStockItem boolean to the item
export async function getOriginalFromItem(itemMinimal: t.ItemMinimal, input: GetItemInput) {

  const item = { ...itemMinimal }
  // Returns item.item if item is not null or undefined
  // if (item && item.item) {
  //   return item.item;
  // }

  // Check the itemType and tries to find the itemId either in the meals, products, stockMeals, stockProducts
  // by matching the itemId to the id or name parameter
  let matchedItem: t.Product | t.Meal | undefined;

  if (item.itemType === "meal") {
    if (item.isStockItem) {
      matchedItem = input.stockItems.byIds[item.itemId];
    }
    else {
      matchedItem = input.meals.find(meal => meal.id === item.itemId)
    }
  } else if (item.itemType === "product") {
    if (item.isStockItem) {
      matchedItem = input.stockItems.byIds[item.itemId];
      if (!matchedItem) {
        const res = await _fetch(`/api/getStockItem?id=${item.itemId}`, {
          method: 'GET',
        });
        matchedItem = await parse(res) as t.Product
      }

    }
    else {
      matchedItem = input.products.find(product => product.id === item.itemId)
    }
  }

  // If no match is found, throws an error "Could not find item in meals or products"
  if (!matchedItem) {
    throw new Error('Could not find item in meals or products');
  }

  return matchedItem;
}

// @todo move to item utils

// Calculate the total calories form array of items
function calculateCalories(items: t.Item[]): number {
  let totalCalories = 0;
  for (const item of items) {
    const calories = item.item.calories || 0;
    totalCalories += (calories * item.prosentage);
  }
  return totalCalories;
}

// Calculate the total protein form array of items
function calculateProteins(items: t.Item[]): number {
  let totalProteins = 0;
  for (const item of items) {
    const protein = item.item.protein || 0;
    totalProteins += (protein * item.prosentage);
  }
  return totalProteins;
}

function calculateMacros(items: t.Item[]) {
  let totalProteins = 0;
  let totalCalories = 0;
  let totalGrams = 0;
  for (const item of items) {
    const protein = item.item.protein || 0;
    const calories = item.item.calories || 0;
    const grams = item.item.grams || 0;
    totalProteins += (protein * item.prosentage);
    totalCalories += (calories * item.prosentage);
    totalGrams += (grams * item.prosentage);
  }
  return {
    calories: totalCalories,
    protein: totalProteins,
    grams: totalGrams
  };
}

function updateItem() {
  //@todo: check if it is custom

}

const itemApi = {
  createItemWrapper,
  getOriginalFromItem,

  calculateCalories,
  calculateProteins,
  calculateMacros,

  updateItem,

}

export type ItemApi = typeof itemApi;
export default itemApi
