
// api result

export type ResponseResult = {
  success: boolean;
  message: any;
};

// diet calculation

export type ZoningGroup =
  "extremeWeightLoss" |
  "weightLoss" |
  "maintenance" |
  "weightGain" |
  "extremeWeightGain"


export type Zone = 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21;


export type FutureResult = {
  day: number;
  week: number;
  month: number;
};


export type BMICategory = "Underweight" | "Normal weight" | "Overweight" | "Obese";

export type BMIResult = {
  bmi: number;
  category: BMICategory;
};

// whitings
export type Withings = {
  access_token: string;
  refresh_token: string;
  expires_in: number
  access_token_created: number
}

// oura
export type Oura = {
  access_token: string;
}

// dietGoals
// @todo: create own api
export type DietGoals = {
  id: string;
  name?: string;
  description?: string;
  targetCalories: number;
  targetProteins: number;
  targerWater: number;
}

// userInfo
export type UserInfo = {
  weight: number;
  height: number;
  age: number;
  gender: string;
}

// user

export type User = {
  id: string;

  // dietGoalId: string;
  // dietGoal?:DietGoals;

  targetCalories: number;
  targetProteins: number;

  weight?: number;
  height?: number;
  age?: number;
  gender?: string;
  goal?: Zone;

  deficitOrSurplus?: number; // manual override
  caloryExpenditure?: number; // manual override

  withings?: Withings;
  oura?: Oura;
}

export type References = { [referenceKey: string]: boolean }

// product

export type Product = {
  id: string,
  type: ItemType;
  name: string;
  description?: string;
  thumbnail?: string;

  protein: number;
  calories: number
  grams: number;

  isStockItem: boolean // makes it easy to find the source just from looking at the item
  fromCustomMeal?: boolean; // shows if it is not a stored product. But nice to use for future suggestions on autocomplete
  fromCustomDaily?: boolean; // shows if it is not a stored product. But nice to use for future suggestions on autocomplete
  createdAt?: string;
  updatedAt?: string;

  isDeleted?: boolean;

  referenceMeals?: References;
  referenceDailies?: References;
}

// meal

export type Meal = {
  id: string,
  type: ItemType;
  name: string;
  description?: string;
  thumbnail?: string;

  products: Item[];
  protein: number;
  calories: number;
  grams: number;

  isStockItem: boolean // makes it easy to find the source just from looking at the item
  fromCustomDaily?: boolean; // shows if it is not a stored Meal. But nice to use for future suggestions on autocomplete
  createdAt?: string;
  updatedAt?: string;

  isDeleted?: boolean;

  referenceProducts?: References;
  referenceDailies?: References;
}

export type MealMinimal = Omit<Meal, "products" | "protein" | "calories" | "grams"> & {
  products: ItemMinimal[]
}

// items

export type ItemType = "product" | "meal"

export type Item = {
  id: string
  name: string
  description?: string;

  createdAt: string
  updatedAt?: string

  prosentage: number

  isStockItem?: boolean // makes it easy to find the source just from looking at the item
  updateOriginalItem?: boolean, // if true, one can change all input fields of the original item
  isLocked?: boolean // if true, one can only change the prosentage, not the actual item

  itemType: ItemType
  itemId: string // reference id to the original item
  item: Product | Meal  //orignal full item, handy to add it directyl to the object sometimes
}

export type ItemMinimal = Omit<Item, "item">

// daily

export type DailyDiet = {
  id: string;
  createdAt: string;
  updatedAt?: string;

  dailyItems: Item[];

  yesterdaysCaloryDiff: number;
  yesterdaysProteinDiff: number;
  // yesterdayWaterDiff: number;

  protein: number;
  calories: number;
  grams: number;

}

export type DailyDietMinimal = Omit<DailyDiet, "protein" | "calories" | "grams" | "dailyItems"> & {
  dailyItems: ItemMinimal[]

}

// stock

export type StockType = ItemType | "both"
export type StockItem = Product | Meal

export type StockStateNormalized<T extends StockItem> = {
  allIds: string[],
  byIds: Record<string, T>;
}

