import * as t from "@/diet-server/diet.types";
import baseApi from "@/diet-server/base.api";
import userApi from "@/diet-server/user/user.api";
import mealApi from "@/diet-server/meal/meal.api";
import productApi from "@/diet-server/product/product.api";
import stockApi from "@/diet-server/stock/stock.api";
import itemApi, { type GetItemInput } from '@/diet-server/item/item.api'
import { STOCK_TYPE } from "@/diet-server/stock/stock.constants";
import { createDailyObject } from '@/diet-server/daily/daily.utils'
import { getISODate } from "@/diet-server/utils/date.utils";

// @todo: merge with populate meal
function populateDaily(dailyDietMinimal: t.DailyDietMinimal, lookup: GetItemInput) {
  const newItems: t.Item[] = []

  for (const itemMinimal of dailyDietMinimal.dailyItems) {
    // we update the item with the original item in case it has changed
    const originalItem = itemApi.getOriginalFromItem(itemMinimal, lookup)
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
  let dailyDietMinimal: t.DailyDietMinimal = await baseApi.makeReqAndExec<t.DailyDiet>({
    proc: "getDaily",
    vars: {
      userId,
      dateKey
    }
  })
  if (dailyDietMinimal) {
    // add the product and meal objects to the dailyItems for ease of use
    const meals = await mealApi.getMeals({ userId })
    const products = await productApi.getProducts({ userId })
    const stockItems = stockApi.getStockItems({ type: STOCK_TYPE.both })
    const lookup = { meals, products, stockItems }

    const dailyItems: t.Item[] = populateDaily(dailyDietMinimal, lookup)

    const dailyDiet: t.DailyDiet = { ...dailyDietMinimal, dailyItems }
    return dailyDiet
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
      yesterdaysCaloryDiff = targetCalories - itemApi.calculateCalories(y)
      yesterdaysProteinDiff = targetProteins - itemApi.calculateProteins(y)
    }

    const newDaily: t.DailyDiet = dailyApi.createDailyObject({
      dateKey,
      dailyItems: [],
      yesterdaysCaloryDiff,
      yesterdaysProteinDiff
    })

    // @todo: catch error here
    await baseApi.makeReqAndExec<t.DailyDiet>({
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
  const r = await dailyApi.updateDaily({ userId, daily })
  return r
}

type UpdateDailyInput = {
  userId: string,
  daily: Partial<t.DailyDiet> & { id: string }
}
// Update a daily diet for a given user and date
export async function updateDaily({ userId, daily }: UpdateDailyInput): Promise<t.ResponseResult> {
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


const dailyApi = {
  createDailyObject,
  getTodaysDailyKey,
  getPriorDaily,
  getDaily,
  addDailyItem,
  updateDaily,
  removeDailyItem,
};

export type DailyApi = typeof dailyApi;
export default dailyApi;
