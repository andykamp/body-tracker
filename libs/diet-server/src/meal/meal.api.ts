import * as t from "@/diet-server/diet.types";
import * as f from "@/diet-server/meal/__support__/meal.fixtures";
import productApi from "@/diet-server/product/product.api";
import { USERS_FIXTURE } from "@/diet-server/user/__support__/user.fixtures";

type GetMealInput = {
  name: string
}

export async function getMeal({ name }: GetMealInput): Promise<t.Meal> {
  return f.MEALS_FIXTURES[name];
}

type GetMealsInput = {
}

export async function getMeals({ }: GetMealsInput): Promise<t.Meals> {
  return f.MEALS_FIXTURES;
}

type GetMealToUserInput = {
  userId: string;
  name: string
}

export async function getMealToUser({ name }: GetMealToUserInput): Promise<t.Meal> {
  return f.MEALS_FIXTURES[name];
}

type GetMealsToUserInput = {
  userId: string;
}

export async function getMealsToUser({ }: GetMealsToUserInput): Promise<t.Meals> {
  return f.MEALS_FIXTURES;
}

type AddMealInput = {
  meal: t.Meal
}

export async function addMeal({ meal }: AddMealInput): Promise<t.ResponseResult> {
  f.MEALS_FIXTURES[meal.name] = meal;
  // Return a success result.
  return {
    success: true,
    message: "Meal added successfully",
  };
}

export type AddMealToUserInput = {
  userId: string;
  name: string;
  products: (string | t.Product)[];
};


/**
 * Adds a meal to the user's meal list and updates the user's data.
 *
 * @param {AddMealToUserInput} input - The input object containing the user ID, the meal name, and the list of products in the meal.
 *
 * @returns {t.ResponseResult} The result object containing a success flag and a message indicating the success or failure of the operation.
 */
export async function addMealToUser(input: AddMealToUserInput): Promise<t.ResponseResult> {
  const { userId, name, products } = input;

  // Retrieve the user data from the fixture data using the user ID.
  const user = USERS_FIXTURE[userId];

  // If the user data does not exist, return an error result.
  if (!user) {
    return {
      success: false,
      message: "User not found",
    };
  }

  let totalProtein = 0;
  let totalCalories = 0;
  let totalGrams = 0;

  // Create an empty list of products for the meal.
  const mealProducts: t.Product[] = [];

  // Loop through the list of products in the meal.
  for (const item of products) {
    let product: t.Product;

    // If the item is a string, assume it is the name of an existing product in the user's product list.
    if (typeof item === "string") {
      // Retrieve the product data from the user's product list using the product name.
      product = user.products[item];

      // If the product data does not exist, return an error result.
      if (!product) {
        return {
          success: false,
          message: `Product '${item}' not found in user's products`,
        };
      }
    } else {
      // If the item is an object, assume it is a new product to be added to the user's product list.
      const addProductResult = await productApi.addProductToUser({ userId, product: item });

      // If the add product operation fails, return the error result.
      if (!addProductResult.success) {
        return addProductResult;
      }

      product = item;
    }

    // Add the product to the meal product list.
    mealProducts.push(product);

    // Calculate the total protein, calories, and grams for the meal based on the product data.
    totalProtein += product.protein || 0;
    totalCalories += product.calories || 0;
    totalGrams += product.grams || 0;
  }

  // If the meal product list is empty and the meal name or total protein and calories are not provided, return an error result.
  if (!mealProducts.length && (!name || (!totalProtein && !totalCalories))) {
    return {
      success: false,
      message: "Invalid meal data",
    };
  }

  // Create a meal object using the meal name, product names, and total protein, calories, and grams for the meal.
  const meal: t.Meal = {
    name,
    products: mealProducts.map((p) => p.name),
    protein: totalProtein,
    calories: totalCalories,
    totalGrams: totalGrams,
  };

  // Add the meal to the user's meal list.
  user.meals = user.meals || {};
  user.meals[name] = meal;

  // Return a success result.
  return {
    success: true,
    message: "Meal added successfully",
  };
}

export type UpdateMealInput = {
  key: string;
  newMeal: t.Meal;
};

export function updateMeal(input: UpdateMealInput): t.ResponseResult {
  const { key, newMeal } = input;

  if (!f.MEALS_FIXTURES[key]) {
    return {
      success: false,
      message: `Meal '${key}' not found in meals fixture`,
    };
  }
  f.MEALS_FIXTURES[key] = newMeal;
  return {
    success: true,
    message: `Meal '${key}' updated successfully`,
  };
}

export function updateMealToUser(
  userId: string,
  input: UpdateMealInput
): t.ResponseResult {
  const { key, newMeal } = input;
  const user = USERS_FIXTURE[userId];
  if (!user || !user.meals || !user.meals[key]) {
    return {
      success: false,
      message: `Meal '${key}' not found for user '${userId}'`,
    };
  }
  user.meals[key] = newMeal;
  return {
    success: true,
    message: `Meal '${key}' updated successfully for user '${userId}'`,
  };
}

export type DeleteMealInput = {
  key: string;
};

export function deleteMeal(input: DeleteMealInput): t.ResponseResult {
  const { key } = input;
  if (!f.MEALS_FIXTURES[key]) {
    return {
      success: false,
      message: `Meal '${key}' not found in meals fixture`,
    };
  }
  delete f.MEALS_FIXTURES[key];
  return {
    success: true,
    message: `Meal '${key}' deleted successfully`,
  };
}

export function deleteMealToUser(
  userId: string,
  input: DeleteMealInput
): t.ResponseResult {
  const { key } = input;
  const user = USERS_FIXTURE[userId];
  if (!user || !user.meals || !user.meals[key]) {
    return {
      success: false,
      message: `Meal '${key}' not found for user '${userId}'`,
    };
  }
  delete user.meals[key];
  return {
    success: true,
    message: `Meal '${key}' deleted successfully for user '${userId}'`,
  };
}

const mealApi = {
  getMeal,
  getMealToUser,
  getMeals,
  getMealsToUser,
  addMeal,
  addMealToUser,
  updateMeal,
  updateMealToUser,
  deleteMeal,
  deleteMealToUser,
};

export type MealApi = typeof mealApi;
export default mealApi;



