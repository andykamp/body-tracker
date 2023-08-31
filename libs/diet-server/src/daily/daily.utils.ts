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

export function getTodaysDailyKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');

  return `${year}${month}${day}`;
}

export function convertToDateObject(
  dateStr: string
): { year: number, month: number, day: number } {
  const year = parseInt(dateStr.substring(0, 4), 10);
  const month = parseInt(dateStr.substring(4, 6), 10);
  const day = parseInt(dateStr.substring(6, 8), 10);

  return { year, month, day };
}

export function adjustDateByXDays(dateStr: string, x: number): string {
  const year = parseInt(dateStr.substring(0, 4), 10);
  const month = parseInt(dateStr.substring(4, 6), 10) - 1; // months in JavaScript are 0-indexed
  const day = parseInt(dateStr.substring(6, 8), 10);

  const dateObj = new Date(year, month, day);
  dateObj.setDate(dateObj.getDate() + x);

  // Format the new date object back to the format `${year}${month}${day}`
  const adjustedYear = dateObj.getFullYear().toString();
  const adjustedMonth = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const adjustedDay = dateObj.getDate().toString().padStart(2, '0');

  return `${adjustedYear}${adjustedMonth}${adjustedDay}`;
}
