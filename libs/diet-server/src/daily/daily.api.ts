import * as t from "@/diet-server/diet.types";
import * as dt from "@/diet-server/daily/daily.types";
import baseApi from "@/diet-server/base.api";
import userApi from "@/diet-server/user/user.api";
import mealApi from "@/diet-server/meal/meal.api";
import productApi from "@/diet-server/product/product.api";
import stockApi from "@/diet-server/stock/stock.api";
import itemApi from '@/diet-server/item/item.api'
import { STOCK_TYPE } from "@/diet-server/stock/stock.constants";
import { getISODate } from "@/diet-server/utils/date.utils";
import { assertMeal, assertProduct } from '@/diet-server/utils/asserts.utils'
import { populateMinimizedItems } from '@/diet-server/utils/common.utils'
import {
  createDailyObject,
  minimizeDaily,
  getTodaysDailyKey,
  getMacros,
  updateMacros,
  adjustDateByXDays
} from '@/diet-server/daily/daily.utils'

async function addDaily({
  userId,
  daily
}: dt.addDailyInput) {
  await baseApi.makeReqAndExec<t.DailyDietMinimal>({
    proc: "addDaily",
    vars: {
      userId,
      daily: minimizeDaily(daily)
    }
  })
  return daily
}

async function getYestedaysDiff({
  userId,
  dateKey
}: dt.getYesterdaysDiffInput) {

  // get yesterdays daily to calculate the remaining calories and protein
  const yesterdaysDateKey = adjustDateByXDays(dateKey, -1)
  console.log('getting yers', yesterdaysDateKey);
  const yesterdaysDaily = await dailyApi.getDaily({
    userId,
    dateKey: yesterdaysDateKey,
    skipCreate: true
  })
  console.log('yesterad', yesterdaysDaily);

  if (yesterdaysDaily) {
    const user = await userApi.getUser({ uid: userId })
    const { targetCalories, targetProteins } = user
    const yesterdaysCaloryDiff = targetCalories - yesterdaysDaily.calories
    const yesterdaysProteinDiff = targetProteins - yesterdaysDaily.protein
    // yesterdayWaterDiff =  targetWater - yesterdaysDaily.water
    return {
      yesterdaysCaloryDiff,
      yesterdaysProteinDiff,
      // yesterdayWaterDiff,
    }
  }
  else {
    return {
      yesterdaysCaloryDiff: 0,
      yesterdaysProteinDiff: 0,
      // yesterdayWaterDiff,
    }
  }
}

async function getNextDayYesterdayDiff({
  userId,
  daily,
  prevDateKey,
}: dt.GetNextDayYesterdayDiffInput) {

  // calculate the new diff
  const user = await userApi.getUser({ uid: userId })
  const { targetCalories, targetProteins } = user
  const yesterdaysCaloryDiff = targetCalories - daily.calories
  const yesterdaysProteinDiff = targetProteins - daily.protein

  // get and return the updated next day daily
  const nextDateKey = adjustDateByXDays(prevDateKey, 1)
  const nextDailyDietMinimal: t.DailyDietMinimal = await getDailyMinimal({
    userId,
    dateKey: nextDateKey
  })
  return { ...nextDailyDietMinimal, yesterdaysCaloryDiff, yesterdaysProteinDiff } as t.DailyDietMinimal
}

async function getDailyMinimal({
  userId,
  dateKey
}: dt.GetDailyInput) {
  const dailyDietMinimal: t.DailyDietMinimal = await baseApi.makeReqAndExec<t.DailyDietMinimal>({
    proc: "getDaily",
    vars: {
      userId,
      dateKey
    }
  })
  return dailyDietMinimal
}

async function getDaily({
  userId,
  dateKey,
  skipCreate = false
}: dt.GetDailyInput) {
  const dailyDietMinimal: t.DailyDietMinimal = await getDailyMinimal({
    userId,
    dateKey
  })

  console.log('dailyDietMinimal', dailyDietMinimal);
  if (dailyDietMinimal) {
    // add the product and meal objects to the dailyItems for ease of use
    const meals = await mealApi.getMeals({ userId })
    const products = await productApi.getProducts({ userId })
    const stockItems = stockApi.getStockItems({ type: STOCK_TYPE.both })

    const lookup = { meals, products, stockItems }

    const dailyItems: t.Item[] = await populateMinimizedItems(dailyDietMinimal.dailyItems, lookup)

    const { id: dateKey, ...dailyProps } = dailyDietMinimal
    let populatedDaily: t.DailyDiet = dailyApi.createDailyObject({
      dateKey,
      ...dailyProps,
      dailyItems,
    })
    populatedDaily = dailyApi.updateMacros(populatedDaily)
    return populatedDaily
  }
  else if (!skipCreate) {
    const {
      yesterdaysCaloryDiff,
      yesterdaysProteinDiff,
    } = await dailyApi.getYestedaysDiff({ userId, dateKey })

    let newDaily: t.DailyDiet = dailyApi.createDailyObject({
      dateKey,
      yesterdaysCaloryDiff,
      yesterdaysProteinDiff
    })
    newDaily = dailyApi.updateMacros(newDaily)

    const addedDaily = await dailyApi.addDaily({
      userId,
      daily: newDaily
    })
    return addedDaily
  } else {
    return null
  }
}

// Update a daily diet for a given user and date
async function updateDaily({
  userId,
  daily,
  updateMacros = false
}: dt.UpdateDailyInput) {
  let updatedDaily: t.DailyDiet = { ...daily, updatedAt: getISODate() }

  // update macros if specified
  if (updateMacros) {
    updatedDaily = dailyApi.updateMacros(updatedDaily)
  }

  // store to database
  await baseApi.makeReqAndExec<t.DailyDietMinimal>({
    proc: "updateDaily",
    vars: {
      userId,
      daily: minimizeDaily(updatedDaily)
    }
  })

  // udpate next yesterday diff if next exists and is not in the future
  if (daily.id !== dailyApi.getTodaysDailyKey()) {
    const updatedNextDay: t.DailyDietMinimal = await dailyApi.getNextDayYesterdayDiff({ userId, daily: updatedDaily, prevDateKey: daily.id })
    await baseApi.makeReqAndExec<t.DailyDietMinimal>({
      proc: "updateDaily",
      vars: {
        userId,
        daily: updatedNextDay // already minimized
      }
    })
  }
  return updatedDaily
}

// Add a daily meal to the user's meal history
async function addDailyProduct({
  userId,
  daily
}: dt.AddDailyProductInput) {

  // new daily items area always products since it is custom
  let newProduct = productApi.createProductObjectEmpty({ fromCustomDaily: true })
  // make sure to store the reference to the meal it is added to
  newProduct = productApi.addReferenceToDaily(newProduct, daily.id)

  await productApi.addProduct({
    userId: userId,
    product: newProduct
  })

  // create a item around it
  const newItem = itemApi.createItemWrapper(newProduct, newProduct.type, false)
  // make sure it is updated directly and not as a item wrapper
  newItem.updateOriginalItem = true

  // update the daily item
  const newDaily: t.DailyDiet = { ...daily, dailyItems: [...daily.dailyItems, newItem] }
  const updatedDaily = await dailyApi.updateDaily({
    userId,
    daily: newDaily,
    updateMacros: true
  })

  return { newDaily: updatedDaily, newProduct }
}

// Add a daily meal to the user's meal history
async function addDailyMeal({
  userId,
  daily
}: dt.AddDailyMealInput) {

  // new daily items area always products since it is custom
  let newMeal = mealApi.createMealObjectEmpty({ fromCustomDaily: true })
  // make sure to store the reference to the meal it is added to
  newMeal = mealApi.addReferenceToDaily(newMeal, daily.id)

  await mealApi.addMeal({
    userId: userId,
    meal: newMeal
  })

  // create a item around it
  const newItem = itemApi.createItemWrapper(newMeal, newMeal.type, false)
  // make sure it is updated directly and not as a item wrapper
  newItem.updateOriginalItem = true

  // update the daily item
  const newDaily: t.DailyDiet = { ...daily, dailyItems: [...daily.dailyItems, newItem] }
  const updatedDaily = await dailyApi.updateDaily({
    userId,
    daily: newDaily,
    updateMacros: true
  })

  return { newDaily: updatedDaily, newMeal }
}

// Remove a daily diet for a given user and date
async function deleteDailyItem({
  userId,
  daily,
  item
}: dt.RemoveDailyInput) {

  // @todo: remove references
  const deletedItem: t.Product | t.Meal = item.item

  // if custom we need to delete it from the database
  const isCustom = item.updateOriginalItem
  if (isCustom) {
    if (assertMeal(deletedItem)) {
      mealApi.deleteMeal({
        userId,
        meal: deletedItem,
        fromDaily: daily.id
      })
    }
    else if (assertProduct(deletedItem)) {
      productApi.deleteProduct({
        userId,
        product: deletedItem,
        fromDaily: daily.id
      })
    }
  }
  // if not custom we might need remove its references if it is not a stock item
  else {
    if (assertMeal(deletedItem)) {
      if (!deletedItem.isStockItem) {
        const updatedMeal = mealApi.removeReferenceToDaily(deletedItem, daily.id)
        mealApi.updateMeal({ userId, meal: updatedMeal })
      }
    }
    if (assertProduct(deletedItem)) {
      if (!deletedItem.isStockItem) {
        const updatedProduct = productApi.removeReferenceToDaily(deletedItem, daily.id)
        productApi.updateProduct({ userId, updatedProduct })
      }
    }
  }

  const newDaily: t.DailyDiet = { ...daily }
  newDaily.dailyItems = daily.dailyItems.filter(i => {
    return i.id !== item.id;
  });
  const updatedDaily = await dailyApi.updateDaily({
    userId,
    daily: newDaily,
    updateMacros: true
  })
  return { newDaily: updatedDaily, deletedItem };
}

async function updateItem({
  userId,
  daily,
  updatedItem
}: dt.UpdateItemInput) {
  let updatedProductOrMeal: t.Product | t.Meal
  // check if it is a original product or just a item wrapper
  const isCustom = updatedItem.updateOriginalItem
  console.log('updateItem', updatedItem);

  // update the original product
  if (isCustom) {
    updatedProductOrMeal = updatedItem.item
    if (assertMeal(updatedProductOrMeal)) {
      console.log('meaaaaal update',);
      mealApi.updateMeal({
        userId,
        meal: updatedProductOrMeal
      })
    }
    else if (assertProduct(updatedProductOrMeal)) {
      console.log('product update');
      productApi.updateProduct({
        userId,
        updatedProduct: updatedProductOrMeal
      })
    }
  }

  // update the daily item
  const newDaily: t.DailyDiet = { ...daily }
  newDaily.dailyItems = newDaily.dailyItems.map(i => i.id === updatedItem.id ? updatedItem : i);
  const updatedDaily = await dailyApi.updateDaily({
    userId,
    daily: newDaily,
    updateMacros: true
  })

  return { newDaily: updatedDaily, updatedItem }

}

async function convertCustomItemToItem({
  userId,
  daily,
  oldItem,
  newProductOrMeal
}: dt.ConvertCustomItemToItemInput) {
  // delete the custom product that was created
  const customProductOrMealToDelete = oldItem.item

  console.log('delete custom item', customProductOrMealToDelete);
  // @todo: not needed??
  if (assertMeal(customProductOrMealToDelete)) {
    // remove the custom item
    const deletedMeal = mealApi.removeReferenceToDaily(customProductOrMealToDelete, daily.id)
    mealApi.deleteMeal({ userId, meal: deletedMeal })
    // if the new item is not a stock item we need to update ts reference to be inclide this daily
    if (assertMeal(newProductOrMeal)) {
      if (!newProductOrMeal.isStockItem) {
        const updatedMeal = mealApi.addReferenceToDaily(newProductOrMeal, daily.id)
        mealApi.updateMeal({ userId, meal: updatedMeal })
      }
    } else {
      alert('adding a product to a meal')
    }
  }

  else if (assertProduct(customProductOrMealToDelete)) {
    // remove the custom item
    const deletedProduct = productApi.removeReferenceToDaily(customProductOrMealToDelete, daily.id)
    productApi.deleteProduct({ userId, product: deletedProduct })
    // if the new item is not a stock item we need to update ts reference to be inclide this daily
    if (assertProduct(newProductOrMeal)) {
      if (!newProductOrMeal.isStockItem) {
        const updatedProduct = productApi.addReferenceToDaily(newProductOrMeal, daily.id)
        productApi.updateProduct({ userId, updatedProduct })
      }
    } else {
      alert('adding a meal to a product')
    }
  }

  // create a new wrapper item
  const newItem = itemApi.createItemWrapper(newProductOrMeal, newProductOrMeal.type)

  console.log('createNeitem', newItem);
  // update the daily item
  const newDaily: t.DailyDiet = { ...daily }
  newDaily.dailyItems = newDaily.dailyItems.map(i => i.id === oldItem.id ? newItem : i);
  const updatedDaily = await dailyApi.updateDaily({
    userId,
    daily: newDaily,
    updateMacros: true
  })
  return { newDaily: updatedDaily, customProductOrMealToDelete }
}

async function convertItemToCustomItem({
  userId,
  daily,
  item,
  adjustedAttributes = {}
}: dt.ConvertItemToCustomItemInput) {

  // extract the actual product
  const addedProductOrMeal: t.Product | t.Meal = item.item
  for (const key in adjustedAttributes) {
    (addedProductOrMeal as any)[key] = adjustedAttributes[key]
  }
  addedProductOrMeal.fromCustomDaily = true // so that it does not show up in products unless specified
  console.log('added name', addedProductOrMeal.name);

  // create standalone product in database
  // @todo: not needed??
  if (assertMeal(addedProductOrMeal)) {
    const addedMeal = mealApi.addReferenceToDaily(addedProductOrMeal, daily.id)
    mealApi.addMeal({ userId, meal: addedMeal })
  }
  else if (assertProduct(addedProductOrMeal)) {
    const addedProduct = productApi.addReferenceToDaily(addedProductOrMeal, daily.id)
    productApi.addProduct({
      userId,
      product: addedProduct
    })
  }

  // create a new item that references the standalone product
  const newItem: t.Item = {
    ...item,
    name: addedProductOrMeal.name,
    item: addedProductOrMeal,
    itemId: addedProductOrMeal.id,
    itemType: addedProductOrMeal.type,
    updateOriginalItem: true,
    isStockItem: false,
    isLocked: false,
  }

  // update the daily item
  const newDaily: t.DailyDiet = { ...daily }
  newDaily.dailyItems = newDaily.dailyItems.map(i => i.id === newItem.id ? newItem : i);
  const updatedDaily = await dailyApi.updateDaily({
    userId,
    daily: newDaily,
    updateMacros: true
  })
  return { newDaily: updatedDaily, addedProductOrMeal }
}

const dailyApi = {
  getMacros,
  updateMacros,
  createDailyObject,
  getTodaysDailyKey,

  addDaily,
  getYestedaysDiff,
  getNextDayYesterdayDiff,
  getDailyMinimal,
  getDaily,
  updateDaily,
  addDailyProduct,
  addDailyMeal,
  deleteDailyItem,

  updateItem,
  convertCustomItemToItem,
  convertItemToCustomItem,
};

export type DailyApi = typeof dailyApi;
export default dailyApi;
