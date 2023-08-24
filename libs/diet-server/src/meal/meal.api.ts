import * as t from "@/diet-server/diet.types";
import productApi from "@/diet-server/product/product.api";
import stockApi from "@/diet-server/stock/stock.api";
import baseApi from "@/diet-server/base.api";
import itemApi, { type GetItemInput } from '@/diet-server/item/item.api'
import { STOCK_TYPE } from "@/diet-server/stock/stock.constants";
import { createMealObject, createMealObjectEmpty } from "@/diet-server/meal/meal.utils";

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
function updateMacros(meal: t.Meal) {
  const macros = mealApi.getMacros(meal)
  const newMeal = { ...meal, ...macros }
  return newMeal
}

function hasReferences(meal: t.Meal): boolean {
  return hasReferenceToDaily(meal)
}

function hasReferenceToDaily(meal: t.Meal): boolean {
  return meal.referenceDailies && Object.keys(meal.referenceDailies).length > 0
}


// @todo: merge with populate Daily
async function populateMeal(mealMinimal: t.MealMinimal, lookup: GetItemInput) {
  const newProducts: t.Item[] = []
  // populate the meal's products with the original product
  for (const itemMinimal of mealMinimal.products) {
    // we update the item with the original item in case it has changed
    const originalItem = await itemApi.getOriginalFromItem(itemMinimal, lookup)
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
    const populatedMeal = await populateMeal(mealMinimal, { meals: [], products, stockItems })
    meals.push(populatedMeal)
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
}: AddMealInput) {

  // Add the meal to the user's meal list.
  await baseApi.makeReqAndExec<t.MealMinimal>({
    proc: "addMeal",
    vars: {
      userId,
      meal: minimizeMeal(meal)
    }
  })
  return meal

}

export type UpdateMealInput = {
  userId: string;
  meal: t.Meal;
};

async function updateMeal({
  userId,
  meal
}: UpdateMealInput
) {
  // @todo: update all dependent product to remove this meal as a dependency if a meal is removed

  await baseApi.makeReqAndExec<t.MealMinimal>({
    proc: "updateMeal",
    vars: {
      userId,
      meal: minimizeMeal(meal)
    }
  })
  return meal
}

type SoftDeleteMealInput = {
  userId: string,
  meal: t.Meal,
}
async function softDeleteMeal({
  userId,
  meal
}: SoftDeleteMealInput) {
  const updatedMeal: t.Meal = { ...meal, isDeleted: true }
  await mealApi.updateMeal({
    userId,
    meal: updatedMeal
  })
  return updatedMeal
}

type RestoreDeletedMealInput = {
  userId: string,
  meal: t.Meal,
}

async function restoreDeletedMeal({
  userId,
  meal
}: RestoreDeletedMealInput) {
  const updatedMeal: t.Meal = { ...meal, isDeleted: false }
  await mealApi.updateMeal({
    userId,
    meal: updatedMeal
  })
  return updatedMeal
}

type DeleteMealInput = {
  userId: string;
  meal: t.Meal;
}

async function deleteMeal({
  userId,
  meal
}: DeleteMealInput) {

  if (mealApi.hasReferences(meal)) {
    return mealApi.softDeleteMeal({ userId, meal })
  } else {
    // perform the actual update
    await baseApi.makeReqAndExec<t.MealMinimal>({
      proc: "deleteMeal",
      vars: {
        userId,
        id: meal.id,
      }
    })

    // @todo: update all dependent product to remove this meal as a dependency
    // productApi.updateReferencedMeals({ userId, mealId: id })
    // @todo: if the product has no more references to meals or daily we permanently delete the product
    return meal
  }
}


type AddProductToMealInput = {
  userId: string;
  meal: t.Meal;
};

async function addProductToMeal({
  userId,
  meal
}: AddProductToMealInput
) {
  // create a ewn product
  const newProduct = productApi.createProductObjectEmpty(true)
  // make sure to store the reference to the meal it is added to
  if (!newProduct.referenceMeals) newProduct.referenceMeals = {}
  newProduct.referenceMeals[meal.id] = true // @todo: can add as prop to createProductObjectEmpty

  await productApi.addProduct({
    userId: userId,
    product: newProduct
  })

  // create a item around it
  const newItem = itemApi.createItemWrapper(newProduct, "product")
  // make sure it is updated directly and not as a item wrapper
  newItem.updateOriginalItem = true

  // update the meal
  const newMeal: t.Meal = { ...meal, products: [...meal.products, newItem] }
  await mealApi.updateMeal({ userId, meal: newMeal })
  return { newMeal, newProduct }
}

type UpdateProductFromMealInput = {
  userId: string;
  meal: t.Meal;
  updatedItem: t.Item;
};

async function updateProductFromMeal({
  userId,
  meal,
  updatedItem
}: UpdateProductFromMealInput
) {
  let updatedProduct: t.Product
  // check if it is a original product or just a item wrapper
  const isCustom = updatedItem.updateOriginalItem

  // update the original product
  if (isCustom) {
    updatedProduct = updatedItem.item
    productApi.updateProduct({
      userId,
      updatedProduct
    })
  }

  // update the new meal
  // @todo: recalculate the macros
  const newMeal: t.Meal = { ...meal }
  newMeal.products = newMeal.products.map(i => i.id === updatedItem.id ? updatedItem : i);
  const newMealWithMacros = updateMacros(newMeal)
  await mealApi.updateMeal({ userId, meal: newMealWithMacros })
  return { newMeal: newMealWithMacros, updatedProduct }
}

type RemoveProductFromMealInput = {
  userId: string;
  meal: t.Meal;
  item: t.Item;
};

async function removeProductFromMeal({
  userId,
  meal,
  item
}: RemoveProductFromMealInput) {
  // @todo: update all dependent product to remove this meal as a dependency if a meal is removed

  // perform check
  let deletedProduct: t.Product
  if (item.updateOriginalItem) {
    deletedProduct = item.item as t.Product
    productApi.deleteProduct({ userId, product: deletedProduct })
  }

  const newMeal: t.Meal = { ...meal }
  newMeal.products = newMeal.products.filter(i => i.id !== item.id);
  const newMealWithMacros = updateMacros(newMeal)
  await mealApi.updateMeal({ userId, meal: newMealWithMacros })
  console.log('removeprodfrommeal', newMealWithMacros);
  return { newMeal: newMealWithMacros, deletedProduct }
}

type ConvertCustomProductToItemInput = {
  userId: string;
  meal: t.Meal;
  oldItem: t.Item;
  newProduct: t.Product;
}

async function convertCustomProductToItem({
  userId,
  meal,
  oldItem,
  newProduct
}: ConvertCustomProductToItemInput) {

  // delete the custom product that was created
  const customProductToDelete = oldItem.item as t.Product
  // remove this meal as a reference
  delete customProductToDelete.referenceMeals[meal.id]

  console.log('delete custom item', customProductToDelete);
  // @todo:update cache also
  productApi.deleteProduct({ userId, product: customProductToDelete })

  // create a new wrapper item
  const newItem = itemApi.createItemWrapper(newProduct, "product")

  console.log('createNeitem', newItem);
  // update the new meal
  // @todo: recalculate the macros
  const newMeal: t.Meal = { ...meal }
  newMeal.products = newMeal.products.map(i => i.id === oldItem.id ? newItem : i);
  console.log('newMeal', newMeal.products);
  const newMealWithMacros = updateMacros(newMeal)
  await mealApi.updateMeal({ userId, meal: newMealWithMacros })
  return { newMeal: newMealWithMacros, customProductToDelete }
}

type ConvertItemToCustomProductInput = {
  userId: string;
  meal: t.Meal;
  item: t.Item;
  adjustedAttributes: {
    name?: string;
  }
}

async function convertItemToCustomProduct({
  userId,
  meal,
  item,
  adjustedAttributes
}: ConvertItemToCustomProductInput) {

  // extract the actual product
  const addedProduct = item.item
  for (const key in adjustedAttributes) {
    addedProduct[key] = adjustedAttributes[key]
  }
  console.log('added name',addedProduct.name );

  // create standalone product in database
  productApi.addProduct({
    userId,
    product: addedProduct
  })

  // create a new item that references the standalone product
  const newItem:t.Item = {
    ...item,
    name: addedProduct.name,
    item: addedProduct,
    itemId: addedProduct.id,
    updateOriginalItem: true,
    isStockItem: false,
  }
  // update the new meal
  // @todo: recalculate the macros
  const newMeal: t.Meal = { ...meal }
  newMeal.products = newMeal.products.map(i => i.id === newItem.id ? newItem : i);
  console.log('newMeal.products ',newMeal.products  );
  const newMealWithMacros = updateMacros(newMeal)
  await mealApi.updateMeal({ userId, meal: newMealWithMacros })
  return { newMeal: newMealWithMacros, addedProduct }
}

const mealApi = {
  createMealObject,
  createMealObjectEmpty,
  getMacros,
  updateMacros,

  getMeals,
  addMeal,
  updateMeal,
  deleteMeal,

  softDeleteMeal,
  restoreDeletedMeal,

  hasReferenceToDaily,
  hasReferences,

  addProductToMeal,
  updateProductFromMeal,
  removeProductFromMeal,

  convertCustomProductToItem,
  convertItemToCustomProduct,
};

export type MealApi = typeof mealApi;
export default mealApi;
