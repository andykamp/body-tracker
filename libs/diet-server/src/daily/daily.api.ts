import * as t from "@/diet-server/diet.types";
import * as f from "@/diet-server/user/__support__/user.fixtures";
import { USERS_FIXTURE } from "./__support__/daily.fixtures";

export function getTodaysDailyKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');

  return `${year}${month}${day}`;
}

type GetDailyInput={
  userId: string, 
  dateKey: string
}
export async function getDaily({userId, dateKey}:GetDailyInput): Promise<t.DailyDiet> {
  return f.USERS_FIXTURE[userId][dateKey];
}

type AddDailyMealInput={
  userId: string, 
  meal: t.Meal
}
// Add a daily meal to the user's meal history
export async function addDailyMeal({userId, meal}:AddDailyMealInput): Promise<t.Meal | t.ResponseResult> {
  const user: t.User = f.USERS_FIXTURE[userId];
  if (!user) {
    return { success: false, message: "User not found" };
  }

  const dailyDiet: t.DailyDiet = USERS_FIXTURE.dailyDiets[new Date().toISOString().slice(0, 10)];
  if (!dailyDiet) {
    return { success: false, message: "Daily diet not found" };
  }

  dailyDiet.meals[meal.name] = meal;
  return  dailyDiet.meals[meal.name] 
}

// Update a daily diet for a given user and date
export function updateDaily(userId: string, date: string, updatedDailyDiet: Partial<t.DailyDiet>): t.ResponseResult {
  const user: t.User = f.USERS_FIXTURE[userId];
  if (!user) {
    return { success: false, message: "User not found" };
  }

  const dailyDiet: t.DailyDiet = user.daily[date];
  if (!dailyDiet) {
    return { success: false, message: "Daily diet not found" };
  }

  // Update the daily diet properties
  Object.assign(dailyDiet, updatedDailyDiet);
  dailyDiet.updatedAt = new Date();

  return { success: true, message: "Daily diet updated successfully" };
}

// Remove a daily diet for a given user and date
export function removeDaily(userId: string, date: string): t.ResponseResult {
  const user: t.User = f.USERS_FIXTURE[userId];
  if (!user) {
    return { success: false, message: "User not found" };
  }

  const dailyDiet: t.DailyDiet = user.daily[date];
  if (!dailyDiet) {
    return { success: false, message: "Daily diet not found" };
  }

  // Remove the daily diet from the user's daily diets
  delete user.daily[date];

  return { success: true, message: "Daily diet removed successfully" };
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
  removeDaily,
  calculateDailyCalories,
  calculateDailyProteins,
  calculateYesterdaysMissingCalories,
  calculateYesterdaysMissingProtein,
};

export type DailyApi = typeof dailyApi;
export default dailyApi;
