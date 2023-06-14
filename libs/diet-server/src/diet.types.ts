
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

// user

export type User = {
  id: string;

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

// product

export type Product = {
  id: string,
  type: ItemType;
  name: string;
  description?: string;

  protein?: number;
  calories?: number
  grams?: number;

  createdAt?: string;
  updatedAt?: string;
}

// meal

export type Meal = {
  id: string,
  type: ItemType;
  name: string;
  description?: string;

  products: (Item | string)[];
  protein?: number;
  calories?: number;
  grams?: number;

  fromCustomDaily?: boolean; // shows if it is not a stored Meal. But nice to use for future suggestions on autocomplete
  createdAt?: string;
  updatedAt?: string;
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
  itemType: ItemType
  itemId: string // reference id to the original item
  item?: Product | Meal  //orignal full item, handy to add it directyl to the object sometimes
}

// daily

export type DailyDiet = {
  id: string;
  createdAt: string;
  updatedAt?: string;
  dailyItems: Item[];
  yesterdaysCaloryDiff?: number;
  yesterdaysProteinDiff?: number;
}

// filled out daily
export type DailyDietItem = DailyDiet & {
  item: Item;
};

export type DailyDietWithItem = DailyDiet & {
  dailyItems: DailyDietItem[];
};

// stock

export type StockType = ItemType | "both"
export type StockItem = Product | Meal

export type StockStateNormalized<T extends StockItem> = {
  allIds: string[],
  byIds: Record<string, T>;
}

