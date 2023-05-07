import * as t from "@/diet-server/diet.types";
import * as f from "@/diet-server/user/__support__/user.fixtures";
import baseApi from "@/common/api/api.base";

export function getTodaysDailyKey() {
  const now = new Date();
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
    const newDaily: t.DailyDiet = {
      id: dateKey,
      createdAt: new Date(),
      meals: {},
      date: new Date(),
    }
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
  const r = await baseApi.makeReqAndExec<t.DailyDiet>({
    proc: "updateDaily",
    vars: {
      userId,
      daily
    }
  })
  return r
}

type UpdateDailyInput = {
  userId: string,
  dateKey: string,
  updatedDailyDiet: Partial<t.DailyDiet>
}
// Update a daily diet for a given user and date
export async function updateDaily({ userId, dateKey, updatedDailyDiet }: UpdateDailyInput): Promise<t.ResponseResult> {

  const r = await baseApi.makeReqAndExec<t.DailyDiet>({
    proc: "updateDailyMeal",
    vars: {
      userId,
      dateKey,
      updatedDailyDiet
    }
  })
  return r
}

type RemoveDailyInput = {
  userId: string,
  dateKey: string
}
// Remove a daily diet for a given user and date
export async function removeDailyMeal({ userId, dateKey }: RemoveDailyInput): Promise<t.ResponseResult> {
  const r = await baseApi.makeReqAndExec<t.DailyDiet>({
    proc: "removeDailyMeal",
    vars: {
      userId,
      dateKey
    }
  })
  return r
}

// Calculate the user's daily calorie intake
function calculateDailyCalories(userId: string, daily: t.DailyDiet): number {

  let totalCalories = 0;
  for (const meal of Object.values(daily.meals)) {
    totalCalories += meal.calories || 0;
  }
  return totalCalories;
}

// Calculate the user's daily protein intake
function calculateDailyProteins(userId: string, daily: t.DailyDiet): number {
  let totalProteins = 0;
  for (const meal of Object.values(daily.meals)) {
    totalProteins += meal.protein || 0;
  }
  return totalProteins;
}

// Calculate the user's missing calorie intake from yesterday
function calculateYesterdaysMissingCalories(userId: string, yesterdaysDaily: t.DailyDiet): number {
  const dailyCalories = calculateDailyCalories(userId, yesterdaysDaily);
  const targetCalories = f.USERS_FIXTURE[userId].targetCalories;
  return targetCalories - dailyCalories
}

// Calculate the user's missing protein intake from yesterday
function calculateYesterdaysMissingProtein(userId: string, yesterdaysDaily: t.DailyDiet): number {
  const dailyProteins = calculateDailyProteins(userId, yesterdaysDaily);
  const targetProteins = f.USERS_FIXTURE[userId].targetProteins;
  return targetProteins - dailyProteins
}

const dailyApi = {
  getTodaysDailyKey,
  getDaily,
  addDailyMeal,
  updateDaily,
  removeDailyMeal,
  calculateDailyCalories,
  calculateDailyProteins,
  calculateYesterdaysMissingCalories,
  calculateYesterdaysMissingProtein,
};

export type DailyApi = typeof dailyApi;
export default dailyApi;
