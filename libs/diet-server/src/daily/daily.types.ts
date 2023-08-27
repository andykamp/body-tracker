import * as t from "@/diet-server/diet.types";

export type GetDailyInput = {
  userId: string,
  dateKey: string
}

export type UpdateDailyInput = {
  userId: string,
  daily: t.DailyDiet
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
  adjustedAttributes: {
    name?: string;
  }
}
