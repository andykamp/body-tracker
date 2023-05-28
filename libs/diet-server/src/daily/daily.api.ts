import * as t from "@/diet-server/diet.types";
import baseApi from "@/diet-server/base.api";
import userApi from "@/diet-server/user/user.api";
import mealApi from "@/diet-server/meal/meal.api";
import productApi from "@/diet-server/product/product.api";
import stockApi from "@/diet-server/stock/stock.api";
import { STOCK_TYPE } from "@/diet-server/stock/stock.constants";
import itemApi from '@/diet-server/item/item.api'
import { createDailyObject } from '@/diet-server/daily/daily.utils'
import { getISODate } from "@/diet-server/utils/date.utils";

export function getTodaysDailyKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');

  return `${year}${month}${day}`;
}

export function getPriorDaily(daysAgo: number) {
  const now = new Date();
  now.setDate(now.getDate() - daysAgo);  // subtract a day

  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');

  return `${year}${month}${day}`;
}

type GetDailyInput = {
  userId: string,
  dateKey: string
}
export async function getDaily({ userId, dateKey }: GetDailyInput): Promise<t.DailyDiet> {
  let r: t.DailyDiet = await baseApi.makeReqAndExec<t.DailyDiet>({
    proc: "getDaily",
    vars: {
      userId,
      dateKey
    }
  })
  console.log('r',r );
  if (r) {
    // add the product and meal objects to the dailyItems for ease of use
    const meals = await mealApi.getMeals({ userId })
    const products = await productApi.getProducts({ userId })
    const stockItems = stockApi.getStockItems({ type: STOCK_TYPE.both })

    for (let item of r.dailyItems) {
      item.item = await itemApi.getOriginalFromItem(item, { meals, products, stockItems })
    }

    return r
  }
  else {

    let yesterdaysCaloryDiff = 0, yesterdaysProteinDiff = 0
    // get yesterdays daily to calculate the remaining calories and protein
    const y = await baseApi.makeReqAndExec<t.DailyDiet>({
      proc: "getDaily",
      vars: {
        userId,
        dateKey: dailyApi.getPriorDaily(1) // 1 day ago
      }
    })

    if (y) {
      const user = await userApi.getUser({ uid: userId })
      const { targetCalories, targetProteins } = user
      yesterdaysCaloryDiff = targetCalories - calculateDailyCalories(y)
      yesterdaysProteinDiff = targetProteins - calculateDailyProteins(y)
    }

    const newDaily: t.DailyDiet = dailyApi.createDailyObject({
      dateKey,
      dailyItems: [],
      yesterdaysCaloryDiff,
      yesterdaysProteinDiff
    })

    r = await baseApi.makeReqAndExec<t.DailyDiet>({
      proc: "addDaily",
      vars: {
        userId,
        daily: newDaily
      }
    })
    return newDaily
  }
}

type AddDailyMealInput = {
  userId: string,
  daily: Partial<t.DailyDiet> & { id: string }
}
// Add a daily meal to the user's meal history
export async function addDailyItem({ userId, daily }: AddDailyMealInput): Promise<t.Meal | t.ResponseResult> {
  console.log('addDailyItemk', daily,);
  const r = await dailyApi.updateDaily({ userId, daily })
  return r
}

type UpdateDailyInput = {
  userId: string,
  daily: Partial<t.DailyDiet> & { id: string }
}
// Update a daily diet for a given user and date
export async function updateDaily({ userId, daily }: UpdateDailyInput): Promise<t.ResponseResult> {
  console.log('updateDailyu', daily);

  const r = await baseApi.makeReqAndExec<t.DailyDiet>({
    proc: "updateDaily",
    vars: {
      userId,
      daily: { ...daily, updatedAt: getISODate() }
    }
  })
  return r
}

type RemoveDailyInput = {
  userId: string,
  daily: t.DailyDiet
  idToDelete: string
}
// Remove a daily diet for a given user and date
export async function removeDailyItem({ userId, daily, idToDelete }: RemoveDailyInput): Promise<t.DailyDiet> {
  // Filter out the meal with the specified mealId
  const newDailyItems = daily.dailyItems.filter(item => {
    return item.id !== idToDelete;
  });

  const newDaily: t.DailyDiet = {
    ...daily,
    dailyItems: newDailyItems
  }

  await dailyApi.updateDaily({ userId, daily: newDaily });

  return newDaily;
}

// Calculate the user's daily calorie intake
function calculateDailyCalories(daily: t.DailyDiet): number {

  let totalCalories = 0;
  for (const item of daily.dailyItems) {
    totalCalories += (item.item.calories * item.prosentage) || 0;
  }
  return totalCalories;
}

// Calculate the user's daily protein intake
function calculateDailyProteins(daily: t.DailyDiet): number {
  let totalProteins = 0;
  for (const item of daily.dailyItems) {

    totalProteins += (item.item.protein * item.prosentage) || 0;
  }
  return totalProteins;
}


function calculateDailyMacros(daily: t.DailyDiet): { calories: number, proteins: number } {
  console.log('daily', daily);

  let totalProteins = 0;
  let totalCalories = 0;
  for (const item of daily.dailyItems) {
    totalProteins += (item.item.protein * item.prosentage) || 0;
    totalCalories += (item.item.calories * item.prosentage) || 0;
  }

  return {
    calories: totalCalories,
    proteins: totalProteins
  }
}

const dailyApi = {
  createDailyObject,
  getTodaysDailyKey,
  getPriorDaily,
  getDaily,
  addDailyItem,
  updateDaily,
  removeDailyItem,
  calculateDailyCalories,
  calculateDailyProteins,
  calculateDailyMacros,
};

export type DailyApi = typeof dailyApi;
export default dailyApi;
