import * as t from "@/diet-server/diet.types";
import * as mt from "@/diet-server/meal/meal.types";
import productApi from "@/diet-server/product/product.api";
import stockApi from "@/diet-server/stock/stock.api";
import baseApi from "@/diet-server/base.api";
import itemApi, { type GetItemInput } from '@/diet-server/item/item.api'
import { STOCK_TYPE } from "@/diet-server/stock/stock.constants";
import { createMealObject, createMealObjectEmpty } from "@/diet-server/meal/meal.utils";
import { getISODate } from "@/diet-server/utils/date.utils";

function minimizeMeal(
  meal: t.Meal
): t.MealMinimal {
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

function getMacros(
  meal: t.Meal
) {
  const macros = itemApi.calculateMacros(meal.products)
  return macros
}

function updateMacros(
  meal: t.Meal
) {
  const macros = mealApi.getMacros(meal)
  const newMeal = { ...meal, ...macros }
  return newMeal
}

function hasReferences(
  meal: t.Meal
): boolean {
  return hasReferenceToDaily(meal)
}

function hasReferenceToDaily(
  meal: t.Meal
): boolean {
  return meal.referenceDailies && Object.keys(meal.referenceDailies).length > 0
}

function addReferenceToDaily(
  meal: t.Meal,
  dailyId: string
): t.Meal {
  const newMeal = { ...meal }
  if (!newMeal.referenceDailies) newMeal.referenceDailies = {}
  newMeal.referenceDailies[dailyId] = true
  return newMeal
}

function removeReferenceToDaily(
  meal: t.Meal,
  dailyId: string
): t.Meal {
  const newMeal = { ...meal }
  if (!newMeal.referenceDailies) throw new Error('Meal does not have referenceDailies')
  delete newMeal.referenceDailies[dailyId]
  return newMeal
}

// @todo: merge with populate Daily
async function populateMeal(
  mealMinimal: t.MealMinimal,
  lookup: GetItemInput
) {
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

async function getMeals({
  userId
}: mt.GetMealsInput) {
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
}: mt.AddMealInput) {

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

async function updateMeal({
  userId,
  meal
}: mt.UpdateMealInput) {
  // @todo: update all dependent product to remove this meal as a dependency if a meal is removed

  const updatedMeal = { ...meal, updatedAt: getISODate() }
  await baseApi.makeReqAndExec<t.MealMinimal>({
    proc: "updateMeal",
    vars: {
      userId,
      meal: minimizeMeal(updatedMeal)
    }
  })
  return updatedMeal
}

async function softDeleteMeal({
  userId,
  meal
}: mt.SoftDeleteMealInput) {
  const updatedMeal: t.Meal = { ...meal, isDeleted: true }
  return await mealApi.updateMeal({
    userId,
    meal: updatedMeal
  })
}

async function restoreDeletedMeal({
  userId,
  meal
}: mt.RestoreDeletedMealInput) {
  const updatedMeal: t.Meal = { ...meal, isDeleted: false }
  return await mealApi.updateMeal({
    userId,
    meal: updatedMeal
  })
}

async function deleteMeal({
  userId,
  meal,
  fromDaily
}: mt.DeleteMealInput) {

  let mealToDelete = fromDaily ? mealApi.removeReferenceToDaily(
    meal,
    fromDaily
  ) : meal


  if (mealApi.hasReferences(mealToDelete)) {
    return mealApi.softDeleteMeal({ userId, meal: mealToDelete })
  } else {
    // perform the actual update
    await baseApi.makeReqAndExec<t.MealMinimal>({
      proc: "deleteMeal",
      vars: {
        userId,
        id: mealToDelete.id,
      }
    })

    // @todo: update all dependent product to remove this meal as a dependency
    // productApi.updateReferencedMeals({ userId, mealId: id })
    // @todo: if the product has no more references to meals or daily we permanently delete the product
    return mealToDelete
  }
}


async function addProductToMeal({
  userId,
  meal
}: mt.AddProductToMealInput
) {
  // create a ewn product
  let newProduct = productApi.createProductObjectEmpty({fromCustomMeal:true})
  // make sure to store the reference to the meal it is added to
  newProduct = productApi.addReferenceToMeal(newProduct, meal.id)

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
  const updatedNewMeal = await mealApi.updateMeal({ userId, meal: newMeal })
  return { newMeal: updatedNewMeal, newProduct }
}

async function updateProductFromMeal({
  userId,
  meal,
  updatedItem
}: mt.UpdateProductFromMealInput) {
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
  const newMeal: t.Meal = { ...meal }
  newMeal.products = newMeal.products.map(i => i.id === updatedItem.id ? updatedItem : i);
  const newMealWithMacros = updateMacros(newMeal)
  const updatedNewMeal = await mealApi.updateMeal({ userId, meal: newMealWithMacros })
  return { newMeal: updatedNewMeal, updatedProduct }
}

async function removeProductFromMeal({
  userId,
  meal,
  item
}: mt.RemoveProductFromMealInput) {
  // @todo: update all dependent product to remove this meal as a dependency if a meal is removed

  // perform check
  let deletedProduct: t.Product
  const isCustom = item.updateOriginalItem
  if (isCustom) {
    deletedProduct = item.item as t.Product
    // @todo remove this meal as a reference
    productApi.deleteProduct({ userId, product: deletedProduct })
  }

  const newMeal: t.Meal = { ...meal }
  newMeal.products = newMeal.products.filter(i => i.id !== item.id);
  const newMealWithMacros = updateMacros(newMeal)
  const updatedNewMeal = await mealApi.updateMeal({ userId, meal: newMealWithMacros })
  return { newMeal: updatedNewMeal, deletedProduct }
}

async function convertCustomProductToItem({
  userId,
  meal,
  oldItem,
  newProduct
}: mt.ConvertCustomProductToItemInput) {

  // delete the custom product that was created
  let customProductToDelete = oldItem.item as t.Product
  // remove this meal as a reference
  customProductToDelete = productApi.removeReferenceToMeal(customProductToDelete, meal.id)

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
  const updatedNewMeal = await mealApi.updateMeal({ userId, meal: newMealWithMacros })
  return { newMeal: updatedNewMeal, customProductToDelete }
}

async function convertItemToCustomProduct({
  userId,
  meal,
  item,
  adjustedAttributes
}: mt.ConvertItemToCustomProductInput) {

  // extract the actual product
  const addedProduct = item.item
  for (const key in adjustedAttributes) {
    addedProduct[key] = adjustedAttributes[key]
  }
  console.log('added name', addedProduct.name);

  // create standalone product in database
  productApi.addProduct({
    userId,
    product: addedProduct
  })

  // create a new item that references the standalone product
  const newItem: t.Item = {
    ...item,
    name: addedProduct.name,
    item: addedProduct,
    itemId: addedProduct.id,
    itemType: addedProduct.type,
    updateOriginalItem: true,
    isStockItem: false,
  }
  // update the new meal
  // @todo: recalculate the macros
  const newMeal: t.Meal = { ...meal }
  newMeal.products = newMeal.products.map(i => i.id === newItem.id ? newItem : i);
  console.log('newMeal.products ', newMeal.products);
  const newMealWithMacros = updateMacros(newMeal)
  const updatedNewMeal = await mealApi.updateMeal({ userId, meal: newMealWithMacros })
  return { newMeal: updatedNewMeal, addedProduct }
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
  addReferenceToDaily,
  removeReferenceToDaily,

  addProductToMeal,
  updateProductFromMeal,
  removeProductFromMeal,

  convertCustomProductToItem,
  convertItemToCustomProduct,
};

export type MealApi = typeof mealApi;
export default mealApi;
