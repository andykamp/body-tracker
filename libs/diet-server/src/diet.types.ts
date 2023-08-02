
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

  isStockItem: boolean // makes it easy to find the source just from looking at the item
  fromCustomMeal?: boolean; // shows if it is not a stored product. But nice to use for future suggestions on autocomplete
  createdAt?: string;
  updatedAt?: string;
}

// meal

export type Meal = {
  id: string,
  type: ItemType;
  name: string;
  description?: string;

  products: Item[];
  protein?: number;
  calories?: number;
  grams?: number;

  isStockItem: boolean // makes it easy to find the source just from looking at the item
  fromCustomDaily?: boolean; // shows if it is not a stored Meal. But nice to use for future suggestions on autocomplete
  createdAt?: string;
  updatedAt?: string;
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
  yesterdaysCaloryDiff?: number;
  yesterdaysProteinDiff?: number;
}

export type DailyDietMinimal = Omit<DailyDiet, "dailyItems"> & {
  dailyItems: ItemMinimal[]

}

// stock

export type StockType = ItemType | "both"
export type StockItem = Product | Meal

export type StockStateNormalized<T extends StockItem> = {
  allIds: string[],
  byIds: Record<string, T>;
}

