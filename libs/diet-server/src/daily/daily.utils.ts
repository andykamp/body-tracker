import * as t from "@/diet-server/diet.types";
import { getISODate } from "@/diet-server/utils/date.utils";

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
