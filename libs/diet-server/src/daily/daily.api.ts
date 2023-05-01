import * as t from "@/diet-server/diet.types";
import * as fixtures from "@/diet-server/diet.fixtures"; // Assuming the fixtures are imported
import { USERS_FIXTURE } from "./__support__/daily.fixtures";

// Add a daily meal to the user's meal history
function addDailyMeal(userId: string, meal: t.Meal): t.ResponseResult {
  const user: t.User = fixtures.users[userId];
  if (!user) {
    return { success: false, message: "User not found" };
  }

  const dailyDiet: t.DailyDiet = USERS_FIXTURE.dailyDiets[new Date().toISOString().slice(0, 10)];
  if (!dailyDiet) {
    return { success: false, message: "Daily diet not found" };
  }

  dailyDiet.meals[meal.name] = meal;
  return { success: true, message: "Meal added successfully" };
}

// Calculate the user's daily calorie intake
function calculateDailyCalories(userId: string, daily?: t.DailyDiet): number {
  // get the user's daily diet from the database
  if(!daily) {}// ...get daily

  let totalCalories = 0;
  for (const meal of Object.values(daily.meals)) {
    totalCalories += meal.calories || 0;
  }
  return totalCalories;
}

// Calculate the user's daily protein intake
function calculateDailyProteins(userId: string, daily?: t.DailyDiet): number {
  // get the user's daily diet from the database
  if(!daily) {}// ...get daily

  let totalProteins = 0;
  for (const meal of Object.values(daily.meals)) {
    totalProteins += meal.protein || 0;
  }
  return totalProteins;
}

// Calculate the user's missing calorie intake from yesterday
function calculateYesterdaysMissingCalories(userId: string, yesterdaysDaily: t.DailyDiet): number {
  const dailyCalories = calculateDailyCalories(userId, yesterdaysDaily);
  const targetCalories = fixtures.users[userId].targetCalories;
  return targetCalories - dailyCalories
}

// Calculate the user's missing protein intake from yesterday
function calculateYesterdaysMissingProtein(userId: string, yesterdaysDaily: t.DailyDiet): number {
  const dailyProteins = calculateDailyProteins(userId, yesterdaysDaily);
  const targetProteins = fixtures.users[userId].targetProteins; 
  return targetProteins - dailyProteins
}

const dailyApi = {
  addDailyMeal,
  calculateDailyCalories,
  calculateDailyProteins,
  calculateYesterdaysMissingCalories,
  calculateYesterdaysMissingProtein,
};

export type DailyApi = typeof dailyApi;
export default dailyApi;
