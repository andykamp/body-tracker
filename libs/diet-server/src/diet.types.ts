export type ResponseResult = {
  success: boolean;
  message: string;
};

export type User = {
  products: Products;
  meals: Meals;
}

export type Users = {
  [userId: string]: User;
}

export type Product = {
  name: string;
  protein?: number;
  calories?: number;
  grams?: number;
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
}

export type Meals = {
  [key: string]: Meal;
}

