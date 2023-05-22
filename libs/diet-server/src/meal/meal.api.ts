import * as t from "@/diet-server/diet.types";
import * as f from "@/diet-server/meal/__support__/meal.fixtures";
import * as fp from "@/diet-server/product/__support__/product.fixtures";
import productApi from "@/diet-server/product/product.api";
import stockApi from "@/diet-server/stock/stock.api";
import { STOCK_TYPE } from "@/diet-server/stock/stock.constants";
import baseApi from "@/diet-server/base.api";

type GetMealsInput = {
  userId: string;
}

export async function getMeals({ userId }: GetMealsInput): Promise<t.Meals> {
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
  console.log('addMeal', { userId, name, products });

  const userProducts: t.Product[] = await productApi.getProducts({ userId });
  const stockProducts = stockApi.getStockItems({ type: STOCK_TYPE.both });

  console.log('userProducts', userProducts);

  let totalProtein = 0;
  let totalCalories = 0;
  let totalGrams = 0;

  // Create an empty list of products for the meal.
  const mealProducts: t.Product[] = [];

  // Loop through the list of products in the meal.
  for (const item of products) {
    console.log('item', item);
    let product: t.Product;

    // If the item is a string, assume it is the name of an existing product in the user's product list.
    if (typeof item === "string") {
      // Retrieve the product data from the user's product list using the product name.
      product = stockProducts.byIds[item] || userProducts.find(p => p.name === item);
      console.log('product', product, item);

      // If the product data does not exist, return an error result.
      // TODO maybe throw error?
      if (!product) {
        throw new Error(`Product ${item} not found. You cannot spesify a custom string that does not exist in the database`);
      }
    } else {
      // If the item is an object, assume it is a new product to be added to the user's product list.
      console.log('--adding product ', userId, item);
      await productApi.addProduct({ userId, product: item });

      product = item;
    }

    // Add the product to the meal product list.
    if (product) mealProducts.push(product);

    // Calculate the total protein, calories, and grams for the meal based on the product data.
    totalProtein += product.protein || 0;
    totalCalories += product.calories || 0;
    totalGrams += product.grams || 0;
  }

  console.log('outloop', name, mealProducts);
  // If the meal product list is empty and the meal name or total protein and calories are not provided, return an error result.
  if (!mealProducts.length && (!name || (!totalProtein && !totalCalories))) {
    throw new Error(`Invalid meal data`);
  }

  // Create a meal object using the meal name, product names, and total protein, calories, and grams for the meal.
  const meal: t.Meal = {
    name,
    products: mealProducts.map((p) => p.name),
    protein: totalProtein,
    calories: totalCalories,
    totalGrams: totalGrams,
  };

  console.log('new meal added as ', meal);
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
    console.log('dleteMeal', r);
    // Return a success result.
    return {
      success: true,
      message: "Meal updated successfully",
    };
  } catch (e) {
    console.log(e)
    return {
      success: false,
      message: "Update meal failed",
    };
  }
}

const mealApi = {
  getMeals,
  addMeal,
  updateMeal,
  deleteMeal,
};

export type MealApi = typeof mealApi;
export default mealApi;



