import * as t from "@/diet-server/diet.types";
import * as mt from "@/diet-server/meal/meal.types";
import productApi from "@/diet-server/product/product.api";
import stockApi from "@/diet-server/stock/stock.api";
import baseApi from "@/diet-server/base.api";
import itemApi from '@/diet-server/item/item.api'
import { STOCK_TYPE } from "@/diet-server/stock/stock.constants";
import { getISODate } from "@/diet-server/utils/date.utils";
import {
  createMealObject,
  createMealObjectEmpty,
  minimizeMeal,
  getMacros,
  updateMacros,
  hasReferenceToDaily,
  hasReferences,
  addReferenceToDaily,
  removeReferenceToDaily,
} from "@/diet-server/meal/meal.utils";
import { populateMinimizedItems } from '@/diet-server/utils/common.utils'

async function getMeals({
  userId
}: mt.GetMealsInput) {
  const mealsMinimal = await baseApi.makeReqAndExec<t.MealMinimal>({
    proc: "getMeals",
    vars: { userId }
  })

  const products = await productApi.getProducts({ userId })
  const stockItems = stockApi.getStockItems({ type: STOCK_TYPE.both })

  const lookup = { meals: [], products, stockItems }
  const meals: t.Meal[] = []
  for (const mealMinimal of mealsMinimal) {
    const mealProducts = await populateMinimizedItems(mealMinimal.products, lookup)
    let populatedMeal: t.Meal = { ...mealMinimal, products: mealProducts }
    populatedMeal = mealApi.updateMacros(populatedMeal)

    meals.push(populatedMeal)
  }
  return meals
}

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
  meal,
  updateMacros = false
}: mt.UpdateMealInput) {
  // @todo: update all dependent product to remove this meal as a dependency if a meal is removed

  let updatedMeal: t.Meal = { ...meal, updatedAt: getISODate() }

  // update macros if specified
  if (updateMacros) {
    updatedMeal = mealApi.updateMacros(updatedMeal)
  }

  // store in database
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

  const mealToDelete = fromDaily ? mealApi.removeReferenceToDaily(
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

    //update all dependent product to remove this meal as a dependency
    // @todo: do we really want to perm delete product?
    const products = await productApi.getProducts({ userId })
    const referencedProducts = products.filter((p: t.Product) => p.referenceMeals?.[mealToDelete.id])
    for (const product of referencedProducts) {
      const updatedProduct = productApi.removeReferenceToMeal(product, mealToDelete.id)
      if (!productApi.hasReferences(updatedProduct)) {
        await productApi.deleteProduct({ userId, product: updatedProduct })
      } else {
        await productApi.updateProduct({ userId, updatedProduct })
      }
    }
    return mealToDelete
  }
}


async function addProductToMeal({
  userId,
  meal
}: mt.AddProductToMealInput
) {
  // create a ewn product
  let newProduct = productApi.createProductObjectEmpty({ fromCustomMeal: true })
  // make sure to store the reference to the meal it is added to
  newProduct = productApi.addReferenceToMeal(newProduct, meal.id)

  await productApi.addProduct({
    userId: userId,
    product: newProduct
  })

  // create a item around it
  const newItem = itemApi.createItemWrapper(newProduct, "product", false)
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
  const updatedNewMeal = await mealApi.updateMeal({
    userId,
    meal: newMeal,
    updateMacros: true
  })
  return { newMeal: updatedNewMeal, updatedProduct }
}

async function removeProductFromMeal({
  userId,
  meal,
  item
}: mt.RemoveProductFromMealInput) {

  // perform check
  let deletedProduct: t.Product
  const isCustom = item.updateOriginalItem
  if (isCustom) {
    deletedProduct = item.item as t.Product
    // @todo remove this meal as a reference
    productApi.deleteProduct({ userId, product: deletedProduct, fromMeal: meal.id })
  }

  const newMeal: t.Meal = { ...meal }
  newMeal.products = newMeal.products.filter(i => i.id !== item.id);
  const updatedNewMeal = await mealApi.updateMeal({
    userId,
    meal: newMeal,
    updateMacros: true
  })
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
  const newMeal: t.Meal = { ...meal }
  newMeal.products = newMeal.products.map(i => i.id === oldItem.id ? newItem : i);
  const updatedNewMeal = await mealApi.updateMeal({
    userId,
    meal: newMeal,
    updateMacros: true
  })
  return { newMeal: updatedNewMeal, customProductToDelete }
}

async function convertItemToCustomProduct({
  userId,
  meal,
  item,
  adjustedAttributes = {}
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
    isLocked: false,
    updateOriginalItem: true,
    isStockItem: false,
  }
  // update the new meal
  const newMeal: t.Meal = { ...meal }
  newMeal.products = newMeal.products.map(i => i.id === newItem.id ? newItem : i);
  console.log('newMeal.products ', newMeal.products);
  const updatedNewMeal = await mealApi.updateMeal({
    userId,
    meal: newMeal,
    updateMacros: true
  })
  return { newMeal: updatedNewMeal, addedProduct }
}

const mealApi = {
  createMealObject,
  createMealObjectEmpty,
  getMacros,
  updateMacros,
  hasReferenceToDaily,
  hasReferences,
  addReferenceToDaily,
  removeReferenceToDaily,

  getMeals,
  addMeal,
  updateMeal,
  deleteMeal,

  softDeleteMeal,
  restoreDeletedMeal,

  addProductToMeal,
  updateProductFromMeal,
  removeProductFromMeal,

  convertCustomProductToItem,
  convertItemToCustomProduct,
};

export type MealApi = typeof mealApi;
export default mealApi;
