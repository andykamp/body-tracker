import * as t from "@/diet-server/diet.types";

export type addDailyInput = {
  userId: string,
  daily: t.DailyDiet
}

export type getYesterdaysDiffInput = {
  userId: string,
  dateKey: string
}
export type GetNextDayYesterdayDiffInput = {
  userId: string,
  daily: t.DailyDiet,
  prevDateKey: string
}

export type GetDailyInput = {
  userId: string,
  dateKey: string
  skipCreate?: boolean
}

export type UpdateDailyInput = {
  userId: string,
  daily: t.DailyDiet
  updateMacros?: boolean
}

export type AddDailyProductInput = {
  userId: string,
  daily: t.DailyDiet,
}

export type AddDailyMealInput = {
  userId: string,
  daily: t.DailyDiet,
}

export type RemoveDailyInput = {
  userId: string,
  daily: t.DailyDiet,
  item: t.Item
}

export type UpdateItemInput = {
  userId: string,
  daily: t.DailyDiet
  updatedItem: t.Item
}

export type ConvertCustomItemToItemInput = {
  userId: string;
  daily: t.DailyDiet;
  oldItem: t.Item;
  newProductOrMeal: t.Product | t.Meal;
}

export type ConvertItemToCustomItemInput = {
  userId: string;
  daily: t.DailyDiet;
  item: t.Item;
  adjustedAttributes?: {
    [key: string]: any;
  }
}
