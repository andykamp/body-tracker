import * as t from "@/diet-server/diet.types";
import * as f from "@/diet-server/user/__support__/user.fixtures";
import baseApi from "@/common/api/api.base";
import userApi from "@/diet-server/user/user.api";

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
  let r = await baseApi.makeReqAndExec<t.DailyDiet>({
    proc: "getDaily",
    vars: {
      userId,
      dateKey
    }
  })
  if (!r) {
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

    const newDaily: t.DailyDiet = {
      id: dateKey,
      createdAt: new Date(),
      meals: {},
      date: new Date(),
      yesterdaysCaloryDiff,
      yesterdaysProteinDiff

    }
    console.log('adding daily', newDaily);
    r = await baseApi.makeReqAndExec<t.DailyDiet>({
      proc: "addDaily",
      vars: {
        userId,
        daily: newDaily
      }
    })
    return newDaily
  }
  return r
}

type AddDailyMealInput = {
  userId: string,
  daily: Partial<t.DailyDiet>
}
// Add a daily meal to the user's meal history
export async function addDailyMeal({ userId, daily }: AddDailyMealInput): Promise<t.Meal | t.ResponseResult> {
  console.log('userId', daily,);
  const r = await baseApi.makeReqAndExec<t.DailyDiet>({
    proc: "updateDaily",
    vars: {
      userId,
      daily: { ...daily, createdAt: new Date() }
    }
  })
  return r
}

type UpdateDailyInput = {
  userId: string,
  dateKey: string,
  daily: Partial<t.DailyDiet>
}
// Update a daily diet for a given user and date
export async function updateDaily({ userId, dateKey, daily }: UpdateDailyInput): Promise<t.ResponseResult> {

  const r = await baseApi.makeReqAndExec<t.DailyDiet>({
    proc: "updateDaily",
    vars: {
      userId,
      dateKey,
      daily: { ...daily, updatedAt: new Date() }
    }
  })
  return r
}

type RemoveDailyInput = {
  userId: string,
  daily: t.DailyDiet
  mealName: string
}
// Remove a daily diet for a given user and date
export async function removeDailyMeal({ userId, daily, mealName }: RemoveDailyInput): Promise<t.DailyDiet> {
  const { [mealName]: mealToDelete, ...meals } = daily.meals
  const newDaily: t.DailyDiet = {
    ...daily,
    meals
  }
  dailyApi.updateDaily({ userId, dateKey: daily.id, daily: newDaily })
  return newDaily
}

// Calculate the user's daily calorie intake
function calculateDailyCalories(daily: t.DailyDiet): number {

  let totalCalories = 0;
  for (const meal of Object.values(daily.meals)) {
    totalCalories += meal.calories || 0;
  }
  return totalCalories;
}

// Calculate the user's daily protein intake
function calculateDailyProteins(daily: t.DailyDiet): number {
  let totalProteins = 0;
  for (const meal of Object.values(daily.meals)) {
    totalProteins += meal.protein || 0;
  }
  return totalProteins;
}


function calculateDailyMacros(daily: t.DailyDiet): { calories: number, proteins: number } {

  let totalProteins = 0;
  let totalCalories = 0;
  for (const meal of Object.values(daily.meals)) {
    totalProteins += meal.protein || 0;
    totalCalories += meal.calories || 0;
  }

  return {
    calories: totalCalories,
    proteins: totalProteins
  }
}

const dailyApi = {
  getTodaysDailyKey,
  getPriorDaily,
  getDaily,
  addDailyMeal,
  updateDaily,
  removeDailyMeal,
  calculateDailyCalories,
  calculateDailyProteins,
  calculateDailyMacros,
};

export type DailyApi = typeof dailyApi;
export default dailyApi;
