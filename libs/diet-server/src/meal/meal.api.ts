import * as t from "@/diet-server/diet.types";
import productApi from "@/diet-server/product/product.api";
import stockApi from "@/diet-server/stock/stock.api";
import baseApi from "@/diet-server/base.api";
import itemApi, { type GetItemInput } from '@/diet-server/item/item.api'
import { STOCK_TYPE } from "@/diet-server/stock/stock.constants";
import { createMealObject } from "@/diet-server/meal/meal.utils";

function minimizeMeal(meal: t.Meal): t.MealMinimal {
  const { protein, calories, grams, products, ...rest } = meal

  // remove item references
  const productsMinimal: t.ItemMinimal[] = []

  products.forEach((i: t.Item) => {
    const { item, ...rest } = i
    productsMinimal.push(rest)
  })

  const mealMinimal: t.MealMinimal = {
    ...rest,
    products: productsMinimal
  }
  return mealMinimal
}

function getMacros(meal: t.Meal) {
  const macros = itemApi.calculateMacros(meal.products)
  return macros
}

// @todo: merge with populate Daily
function populateMeal(mealMinimal: t.MealMinimal, lookup: GetItemInput) {
  const newProducts: t.Item[] = []
  // populate the meal's products with the original product
  for (const itemMinimal of mealMinimal.products) {
    // we update the item with the original item in case it has changed
    const originalItem = itemApi.getOriginalFromItem(itemMinimal, lookup)
    if (!originalItem) throw new Error('Could not find meal item. Should display warning: ' + itemMinimal.id);
    itemMinimal.name = originalItem.name
    itemMinimal.description = originalItem.description

    newProducts.push({ ...itemMinimal, item: originalItem })
  }

  const macros = itemApi.calculateMacros(newProducts)
  const meal: t.Meal = { ...mealMinimal, ...macros, products: newProducts }
  return meal
}

type GetMealsInput = {
  userId: string;
}

async function getMeals({ userId }: GetMealsInput): Promise<t.Meal[]> {
  const mealsMinimal = await baseApi.makeReqAndExec<t.MealMinimal>({
    proc: "getMeals",
    vars: { userId }
  })

  const products = await productApi.getProducts({ userId })
  const stockItems = stockApi.getStockItems({ type: STOCK_TYPE.both })

  const meals: t.Meal[] = []
  for (const mealMinimal of mealsMinimal) {
    meals.push(populateMeal(mealMinimal, { meals: [], products, stockItems }))
  }
  return meals
}


export type AddMealInput = {
  userId: string;
  meal: t.Meal;
};


/**
 * Adds a meal to the user's meal list and updates the user's data.
 *
 * @param {AddMealInput} input - The input object containing the user ID, the meal name, and the list of products in the meal.
 *
 * @returns {t.ResponseResult} The result object containing a success flag and a message indicating the success or failure of the operation.
 */
async function addMeal({
  userId,
  meal
}: AddMealInput): Promise<t.MealMinimal> {

  // Add the meal to the user's meal list.
  const r = await baseApi.makeReqAndExec<t.MealMinimal>({
    proc: "addMeal",
    vars: {
      userId,
      meal: minimizeMeal(meal)
    }
  })
  return r

}

export type UpdateMealInput = {
  userId: string;
  meal: t.Meal;
};

async function updateMeal({
  userId,
  meal
}: UpdateMealInput
): Promise<t.Meal> {

  const r = await baseApi.makeReqAndExec<t.MealMinimal>({
    proc: "updateMeal",
    vars: {
      userId,
      meal: minimizeMeal(meal)
    }
  })
  return r
}

type DeleteMealInput = {
  userId: string;
  id: string;
}

async function deleteMeal(
  { userId, id }: DeleteMealInput
): Promise<t.ResponseResult> {
  try {
    const r = await baseApi.makeReqAndExec<t.MealMinimal>({
      proc: "deleteMeal",
      vars: {
        userId,
        id,
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
  getMacros,
  getMeals,
  addMeal,
  updateMeal,
  deleteMeal,
};

export type MealApi = typeof mealApi;
export default mealApi;



