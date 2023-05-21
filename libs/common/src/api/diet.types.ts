export type ResponseResult = {
  success: boolean;
  message: string;
};

export type User = {
  id: string;
  daily: DailyDiets;
  products: Products;
  meals: Meals;
  targetCalories: number;
  targetProteins: number;
}

export type Users = {
  [userId: string]: User;
}

export type Product = {
  name: string;
  protein?: number;
  calories?: number;
  grams?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type Products = {
  [key: string]: Product;
}

export type Meal = {
  name: string;
  products: (string | Product)[];
  protein?: number;
  calories?: number;
  totalGrams?: number;
  fromCustomDaily?: boolean; // shows if it is not a stored Meal. But nice to use for future suggestions on autocomplete
  createdAt?: Date;
  updatedAt?: Date;
}

export type Meals = {
  [key: string]: Meal;
}

export type DailyDiet = {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
  meals: Meals;
  date: Date,
  yesterdaysCaloryDiff?: number;
  yesterdaysProteinDiff?: number;
}

export type DailyDiets = {
  [key: string]: DailyDiet;

}

export type StockType = "product" | "meal" | "both"

export type StockItem = Product | Meal

export type StockStateNormalized = {
  allIds: string[],
  byIds: Record<string, StockItem>;
}
