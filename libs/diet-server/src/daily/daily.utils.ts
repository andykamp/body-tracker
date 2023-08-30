import * as t from "@/diet-server/diet.types";
import { getISODate } from "@/diet-server/utils/date.utils";
import itemApi, { type GetItemInput } from '@/diet-server/item/item.api'

export type CreateDailyObjectInput = {
  dateKey: string;
  dailyItems?: t.Item[];
  totalGrams?: number;
  yesterdaysCaloryDiff: number,
  yesterdaysProteinDiff: number
  protein?: number;
  calories?: number;
  grams?: number;
};

export function createDailyObject({
  dateKey,
  dailyItems = [],
  yesterdaysCaloryDiff = 0,
  yesterdaysProteinDiff = 0,

  protein = 0,
  calories = 0,
  grams = 0,

}: CreateDailyObjectInput): t.DailyDiet {
  const daily: t.DailyDiet = {
    id: dateKey,
    createdAt: getISODate(),

    dailyItems,
    yesterdaysCaloryDiff,
    yesterdaysProteinDiff,

    protein,
    calories,
    grams,

  };

  return daily;
}

export function minimizeDaily(
  daily: t.DailyDiet
): t.DailyDietMinimal {

  // extract unused properties
  const { protein, calories, grams, dailyItems, ...rest } = daily

  // remove item references
  const itemsMinimal: t.ItemMinimal[] = []

  // minimize each item
  dailyItems.forEach((i: t.Item) => {
    const { item, ...rest } = i
    itemsMinimal.push(rest)
  })

  const dailyMinimal: t.DailyDietMinimal = {
    ...rest,
    dailyItems: itemsMinimal
  }
  return dailyMinimal
}

export function getMacros(
  daily: t.DailyDiet
) {
  const macros = itemApi.calculateMacros(daily.dailyItems)
  return macros
}

export function updateMacros(
  daily: t.DailyDiet
) {
  const macros = getMacros(daily)
  const newDaily = { ...daily, ...macros }
  return newDaily
}

// @todo: merge with populate meal
export async function populateDaily(
  dailyDietMinimal: t.DailyDietMinimal,
  lookup: GetItemInput
) {
  const newItems: t.Item[] = []

  for (const itemMinimal of dailyDietMinimal.dailyItems) {
    // we update the item with the original item in case it has changed
    const originalItem = await itemApi.getOriginalFromItem(itemMinimal, lookup)
    if (!originalItem) throw new Error('Could not find daily item. Should display warning: ' + itemMinimal.id);
    itemMinimal.name = originalItem.name
    itemMinimal.description = originalItem.description

    newItems.push({ ...itemMinimal, item: originalItem })
  }
  return newItems
}

export function getTodaysDailyKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');

  return `${year}${month}${day}`;
}

export function getPriorDaily(
  daysAgo: number
) {
  const now = new Date();
  now.setDate(now.getDate() - daysAgo);  // subtract a day

  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');

  return `${year}${month}${day}`;
}
