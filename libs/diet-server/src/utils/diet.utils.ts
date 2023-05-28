import * as t from "@/diet-server/diet.types";

export const ZONING_GROUPS: Record<t.ZoningGroup, string> = {
  extremeWeightLoss: "Extreme Weight Loss",
  weightLoss: "Weight Loss",
  maintenance: "Maintenance",
  weightGain: "Weight Gain",
  extremeWeightGain: "Extreme Weight Gain",
};

export const ZONES_TO_GROUP: Record<t.Zone, t.ZoningGroup> = {
  7: "extremeWeightLoss",
  8: "extremeWeightLoss",
  9: "extremeWeightLoss",
  10: "weightLoss",
  11: "weightLoss",
  12: "weightLoss",
  13: "maintenance",
  14: "maintenance",
  15: "maintenance",
  16: "weightGain",
  17: "weightGain",
  18: "weightGain",
  19: "extremeWeightGain",
  20: "extremeWeightGain",
  21: "extremeWeightGain",
};

const poundToKgMulitplyer = 2.2

type CalulateDailyProteinInput = {
  weight: number; // in kg
}

export function calulateDailyProtein({ weight }: CalulateDailyProteinInput): number {
  return weight * poundToKgMulitplyer * 1;
}


type CalulateDailyCalorieInput = {
  weight: number; // in kg
  zone: t.Zone;
}

export function calulateDailyCalories({ weight, zone }: CalulateDailyCalorieInput): number {
  return weight * zone
}



export function calculateBMI(weight: number, height: number): t.BMIResult {
  const bmi = weight / Math.pow(height / 100, 2);
  let category: t.BMICategory = "Normal weight"; // Assign a default category

  if (bmi < 18.5) {
    category = "Underweight";
  } else if (bmi >= 18.5 && bmi < 25) {
    category = "Normal weight";
  } else if (bmi >= 25 && bmi < 30) {
    category = "Overweight";
  } else {
    category = "Obese";
  }

  return {
    bmi,
    category,
  };
}


export function estimateWeightLossDaily(calorieDeficit: number): number {
  const caloriesPerKg = 7700; // Approximately 7700 calories per kilogram
  const weightLossPerDay = calorieDeficit / caloriesPerKg; // Approximation: 7700 calories ≈ 1 kilogram
  return weightLossPerDay
}


export function estimateFutureResults(calorieDeficit: number):
  t.FutureResult {
  const weightLoss = estimateWeightLossDaily(calorieDeficit);

  return {
    day: weightLoss,
    week: weightLoss * 7,
    month: weightLoss * 30,
  };
}

