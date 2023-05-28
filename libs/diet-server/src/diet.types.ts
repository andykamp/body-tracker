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

// stock

export type StockType = ItemType | "both"
export type StockItem = Product | Meal

export type StockStateNormalized<T extends StockItem> = {
  allIds: string[],
  byIds: Record<string, T>;
}

