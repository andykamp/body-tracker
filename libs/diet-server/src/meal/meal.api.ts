import * as t from "@/diet-server/diet.types";
import productApi from "@/diet-server/product/product.api";
import stockApi from "@/diet-server/stock/stock.api";
import { STOCK_TYPE } from "@/diet-server/stock/stock.constants";
import baseApi from "@/diet-server/base.api";
import { createMealObject } from "@/diet-server/meal/meal.utils";

type GetMealsInput = {
  userId: string;
}

export async function getMeals({ userId }: GetMealsInput): Promise<t.Meal[]> {
  const r = await baseApi.makeReqAndExec<t.Meal>({
    proc: "getMeals",
    vars: { userId }
  })
  return r
}


export type AddMealInput = {
  userId: string;
  name: string;
  products: (string | t.Product)[];
};


/**
 * Adds a meal to the user's meal list and updates the user's data.
 *
 * @param {AddMealInput} input - The input object containing the user ID, the meal name, and the list of products in the meal.
 *
 * @returns {t.ResponseResult} The result object containing a success flag and a message indicating the success or failure of the operation.
 */
export async function addMeal({ userId, name, products }: AddMealInput): Promise<t.Meal> {

  const userProducts: t.Product[] = await productApi.getProducts({ userId });
  const stockProducts = stockApi.getStockItems({ type: STOCK_TYPE.both });


  let totalProtein = 0;
  let totalCalories = 0;
  let grams = 0;

  // Create an empty list of products for the meal.
  const mealProducts: t.Product[] = [];

  // Loop through the list of products in the meal.
  for (const item of products) {
    let product: t.Product;

    // If the item is a string, assume it is the name of an existing product in the user's product list.
    if (typeof item === "string") {
      // Retrieve the product data from the user's product list using the product name.
      product = stockProducts.byIds[item] || userProducts.find(p => p.name === item);

      // If the product data does not exist, return an error result.
      // TODO maybe throw error?
      if (!product) {
        throw new Error(`Product ${item} not found. You cannot spesify a custom string that does not exist in the database`);
      }
    } else {
      // If the item is an object, assume it is a new product to be added to the user's product list.
      await productApi.addProduct({ userId, product: item });

      product = item;
    }

    // Add the product to the meal product list.
    if (product) mealProducts.push(product);

    // Calculate the total protein, calories, and grams for the meal based on the product data.
    totalProtein += product.protein || 0;
    totalCalories += product.calories || 0;
    grams += product.grams || 0;
  }

  // If the meal product list is empty and the meal name or total protein and calories are not provided, return an error result.
  if (!mealProducts.length && (!name || (!totalProtein && !totalCalories))) {
    throw new Error(`Invalid meal data`);
  }

  // Create a meal object using the meal name, product names, and total protein, calories, and grams for the meal.
  const meal: t.Meal = mealApi.createMealObject({
    name,
    products: mealProducts.map((p) => p.name),
    protein: totalProtein,
    calories: totalCalories,
    grams
  }
  );

  // Add the meal to the user's meal list.
  const r = await baseApi.makeReqAndExec<t.Meal>({
    proc: "addMeal",
    vars: {
      userId,
      name,
      meal
    }
  })
  return r

}

export type UpdateMealInput = {
  userId: string;
  name: string;
  meal: Partial<t.Meal>;
};

export async function updateMeal({
  userId,
  name,
  meal
}: UpdateMealInput
): Promise<t.Meal> {
  const r = await baseApi.makeReqAndExec<t.Meal>({
    proc: "updateMeal",
    vars: {
      userId,
      name,
      meal
    }
  })
  return r
}

type DeleteMealInput = {
  userId: string;
  name: string;
}

export async function deleteMeal(
  { userId, name }: DeleteMealInput
): Promise<t.ResponseResult> {
  try {
    const r = await baseApi.makeReqAndExec<t.Meal>({
      proc: "deleteMeal",
      vars: {
        userId,
        name,
      }
    })
    // Return a success result.
    return {
      success: true,
      message: "Meal updated successfully",
    };
  } catch (e) {
    console.error(e)
    return {
      success: false,
      message: "Update meal failed",
    };
  }
}

const mealApi = {
  createMealObject,
  getMeals,
  addMeal,
  updateMeal,
  deleteMeal,
};

export type MealApi = typeof mealApi;
export default mealApi;



