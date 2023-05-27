export type ResponseResult = {
  success: boolean;
  message: any;
};

export type User = {
  id: string;

  targetCalories: number;
  targetProteins: number;

  weight?: number;
  height?: number;
  age?: number;
  gender?: string;
  goal?: string;
  deficitOrSurplus?: number;
}

export type Product = {
  name: string;
  protein?: number;
  calories?: number
  grams?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ItemType = "product" | "meal"

export type Item ={
  id: string
  createdAt: Date
  updatedAt?: Date
  prosentage: number
  itemType: ItemType
  itemId: string // reference id to the original item
  item?: Product | Meal  //orignal full item, handy to add it directyl to the object sometimes
}

export type Meal = {
  name: string;
  products: (Item | string)[];
  protein?: number;
  calories?: number;
  totalGrams?: number;
  fromCustomDaily?: boolean; // shows if it is not a stored Meal. But nice to use for future suggestions on autocomplete
  createdAt?: Date;
  updatedAt?: Date;
}

export type DailyDiet = {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
  dailyItems: Item[];
  date: Date,
  yesterdaysCaloryDiff?: number;
  yesterdaysProteinDiff?: number;
}

export type StockType = "product" | "meal" | "both"

export type StockItem = Product | Meal

// Normalize Redux state for fast lookup on searches
export type StockStateNormalized = {
  allIds: string[],
  byIds: Record<string, StockItem>;
}
