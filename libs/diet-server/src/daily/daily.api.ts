import * as t from "@/diet-server/diet.types";
import baseApi from "@/diet-server/base.api";
import userApi from "@/diet-server/user/user.api";
import mealApi from "@/diet-server/meal/meal.api";
import productApi from "@/diet-server/product/product.api";
import stockApi from "@/diet-server/stock/stock.api";
import itemApi, { type GetItemInput } from '@/diet-server/item/item.api'
import { STOCK_TYPE } from "@/diet-server/stock/stock.constants";
import { createDailyObject } from '@/diet-server/daily/daily.utils'
import { getISODate } from "@/diet-server/utils/date.utils";
import { assertMeal, assertProduct } from '@/diet-server/utils/asserts.utils'

function minimizeDaily(daily: t.DailyDiet): t.DailyDietMinimal {
  const { protein, calories, grams, dailyItems, ...rest } = daily

  // remove item references
  const itemsMinimal: t.ItemMinimal[] = []

  dailyItems.forEach((i: t.Item) => {
    const { item, ...rest } = i
    itemsMinimal.push(rest)
  })

  const dailyMinimal: t.DailyDietMinimal = {
    ...rest,
    dailyItems: itemsMinimal
  }
  return dailyMinimal
}

function getMacros(daily: t.DailyDiet) {
  const macros = itemApi.calculateMacros(daily.dailyItems)
  return macros
}

function updateMacros(daily: t.DailyDiet) {
  const macros = dailyApi.getMacros(daily)
  const newDaily = { ...daily, ...macros }
  return newDaily
}


// @todo: merge with populate meal
async function populateDaily(dailyDietMinimal: t.DailyDietMinimal, lookup: GetItemInput) {
  const newItems: t.Item[] = []

  for (const itemMinimal of dailyDietMinimal.dailyItems) {
    // we update the item with the original item in case it has changed
    const originalItem = await itemApi.getOriginalFromItem(itemMinimal, lookup)
    if (!originalItem) throw new Error('Could not find daily item. Should display warning: ' + itemMinimal.id);
    itemMinimal.name = originalItem.name
    itemMinimal.description = originalItem.description

    newItems.push({ ...itemMinimal, item: originalItem })
  }
  return newItems
}

 function getTodaysDailyKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');

  return `${year}${month}${day}`;
}

 function getPriorDaily(daysAgo: number) {
  const now = new Date();
  now.setDate(now.getDate() - daysAgo);  // subtract a day

  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');

  return `${year}${month}${day}`;
}

type GetDailyInput = {
  userId: string,
  dateKey: string
}
 async function getDaily({ userId, dateKey }: GetDailyInput): Promise<t.DailyDiet> {
  const dailyDietMinimal: t.DailyDietMinimal = await baseApi.makeReqAndExec<t.DailyDiet>({
    proc: "getDaily",
    vars: {
      userId,
      dateKey
    }
  })
  if (dailyDietMinimal) {
    console.log('',);
    // add the product and meal objects to the dailyItems for ease of use
    const meals = await mealApi.getMeals({ userId })
    const products = await productApi.getProducts({ userId })
    const stockItems = stockApi.getStockItems({ type: STOCK_TYPE.both })
    const lookup = { meals, products, stockItems }

    const dailyItems: t.Item[] = await populateDaily(dailyDietMinimal, lookup)

    let dailyDiet: t.DailyDiet = { ...dailyDietMinimal, dailyItems }
    dailyDiet = dailyApi.updateMacros(dailyDiet)
    return dailyDiet
  }
  else {

    let yesterdaysCaloryDiff = 0, yesterdaysProteinDiff = 0
    // get yesterdays daily to calculate the remaining calories and protein
    const yesterdaysDateKey = dailyApi.getPriorDaily(1) // 1 day ago
    const yesterdaysDaily = await baseApi.makeReqAndExec<t.DailyDiet>({
      proc: "getDaily",
      vars: {
        userId,
        dateKey: yesterdaysDateKey
      }
    })

    if (yesterdaysDaily) {
      const user = await userApi.getUser({ uid: userId })
      const { targetCalories, targetProteins } = user
      yesterdaysCaloryDiff = targetCalories - yesterdaysDaily.calories
      yesterdaysProteinDiff = targetProteins - yesterdaysDaily.protein
    }

    let newDaily: t.DailyDiet = dailyApi.createDailyObject({
      dateKey,
      yesterdaysCaloryDiff,
      yesterdaysProteinDiff
    })
    newDaily = dailyApi.updateMacros(newDaily)


    // @todo: catch error here
    await baseApi.makeReqAndExec<t.DailyDiet>({
      proc: "addDaily",
      vars: {
        userId,
        daily: minimizeDaily(newDaily)
      }
    })
    return newDaily
  }
}

type UpdateDailyInput = {
  userId: string,
  daily: t.DailyDiet
}

// Update a daily diet for a given user and date
 async function updateDaily({ userId, daily }: UpdateDailyInput) {
  const updatedDaily: t.DailyDiet = { ...daily, updatedAt: getISODate() }
  await baseApi.makeReqAndExec<t.DailyDietMinimal>({
    proc: "updateDaily",
    vars: {
      userId,
      daily: minimizeDaily(updatedDaily)
    }
  })
  return updatedDaily
}

type AddDailyProductInput = {
  userId: string,
  daily: t.DailyDiet,
}
// Add a daily meal to the user's meal history
 async function addDailyProduct({
  userId,
  daily
}: AddDailyProductInput) {

  // new daily items area always products since it is custom
  let newProduct = productApi.createProductObjectEmpty({ fromCustomDaily: true })
  // make sure to store the reference to the meal it is added to
  newProduct = productApi.addReferenceToDaily(newProduct, daily.id)

  await productApi.addProduct({
    userId: userId,
    product: newProduct
  })

  // create a item around it
  const newItem = itemApi.createItemWrapper(newProduct, newProduct.type)
  // make sure it is updated directly and not as a item wrapper
  newItem.updateOriginalItem = true

  // update the daily item
  let newDaily: t.DailyDiet = { ...daily, dailyItems: [...daily.dailyItems, newItem] }
  newDaily = dailyApi.updateMacros(newDaily)
  const updatedDaily = await dailyApi.updateDaily({ userId, daily: newDaily })
  return { newDaily: updatedDaily, newProduct }
}

type AddDailyMealInput = {
  userId: string,
  daily: t.DailyDiet,
}
// Add a daily meal to the user's meal history
 async function addDailyMeal({
  userId,
  daily
}: AddDailyMealInput) {

  // new daily items area always products since it is custom
  let newMeal = mealApi.createMealObjectEmpty({ fromCustomDaily: true })
  // make sure to store the reference to the meal it is added to
  newMeal = mealApi.addReferenceToDaily(newMeal, daily.id)

  await mealApi.addMeal({
    userId: userId,
    meal: newMeal
  })

  // create a item around it
  const newItem = itemApi.createItemWrapper(newMeal, newMeal.type)
  // make sure it is updated directly and not as a item wrapper
  newItem.updateOriginalItem = true

  // update the daily item
  let newDaily: t.DailyDiet = { ...daily, dailyItems: [...daily.dailyItems, newItem] }
  newDaily = dailyApi.updateMacros(newDaily)
  const updatedDaily = await dailyApi.updateDaily({ userId, daily: newDaily })
  return { newDaily: updatedDaily, newMeal }
}

type RemoveDailyInput = {
  userId: string,
  daily: t.DailyDiet,
  item: t.Item
}
// Remove a daily diet for a given user and date
 async function deleteDailyItem({ userId, daily, item }: RemoveDailyInput) {

  // @todo: remove references
  let deletedItem: t.Product | t.Meal
  const isCustom = item.updateOriginalItem
  if (isCustom) {
    deletedItem = item.item
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

  let newDaily: t.DailyDiet = { ...daily }
  newDaily.dailyItems = daily.dailyItems.filter(i => {
    return i.id !== item.id;
  });

  newDaily = dailyApi.updateMacros(newDaily)
  const updatedDaily = await dailyApi.updateDaily({ userId, daily: newDaily });
  return { newDaily: updatedDaily, deletedItem };
}

type UpdateItemInput = {
  userId: string,
  daily: t.DailyDiet
  updatedItem: t.Item
}

async function updateItem({
  userId,
  daily,
  updatedItem
}: UpdateItemInput) {
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
  let newDaily: t.DailyDiet = { ...daily }
  newDaily.dailyItems = newDaily.dailyItems.map(i => i.id === updatedItem.id ? updatedItem : i);
  console.log('newDaily.dailyitem', newDaily.dailyItems);
  newDaily = dailyApi.updateMacros(newDaily)
  const updatedDaily = await dailyApi.updateDaily({ userId, daily: newDaily })
  return { newDaily: updatedDaily, updatedItem }

}

type ConvertCustomItemToItemInput = {
  userId: string;
  daily: t.DailyDiet;
  oldItem: t.Item;
  newProductOrMeal: t.Product | t.Meal;
}
async function convertCustomItemToItem({
  userId,
  daily,
  oldItem,
  newProductOrMeal
}: ConvertCustomItemToItemInput) {
  // delete the custom product that was created
  const customProductOrMealToDelete = oldItem.item

  console.log('delete custom item', customProductOrMealToDelete);
  // @todo: not needed??
  if (assertMeal(customProductOrMealToDelete)) {
    const deletedMeal = mealApi.removeReferenceToDaily(customProductOrMealToDelete, daily.id)
    mealApi.deleteMeal({ userId, meal: deletedMeal })
  }
  else if (assertProduct(customProductOrMealToDelete)) {
    const deletedProduct = productApi.removeReferenceToDaily(customProductOrMealToDelete, daily.id)
    productApi.deleteProduct({ userId, product: deletedProduct })
  }

  // create a new wrapper item
  const newItem = itemApi.createItemWrapper(newProductOrMeal, newProductOrMeal.type)

  console.log('createNeitem', newItem);
  // update the daily item
  let newDaily: t.DailyDiet = { ...daily }
  newDaily.dailyItems = newDaily.dailyItems.map(i => i.id === oldItem.id ? newItem : i);
  newDaily = dailyApi.updateMacros(newDaily)
  const updatedDaily = await dailyApi.updateDaily({ userId, daily: newDaily })
  return { newDaily: updatedDaily, customProductOrMealToDelete }
}

type ConvertItemToCustomItemInput = {
  userId: string;
  daily: t.DailyDiet;
  item: t.Item;
  adjustedAttributes: {
    name?: string;
  }
}

async function convertItemToCustomItem({
  userId,
  daily,
  item,
  adjustedAttributes
}: ConvertItemToCustomItemInput) {

  // extract the actual product
  let addedProductOrMeal = item.item
  for (const key in adjustedAttributes) {
    addedProductOrMeal[key] = adjustedAttributes[key]
  }
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
  }

  // update the daily item
  let newDaily: t.DailyDiet = { ...daily }
  newDaily.dailyItems = newDaily.dailyItems.map(i => i.id === newItem.id ? newItem : i);
  newDaily = dailyApi.updateMacros(newDaily)
  const updatedDaily = await dailyApi.updateDaily({ userId, daily: newDaily })
  return { newDaily: updatedDaily, addedProductOrMeal }
}

const dailyApi = {
  getMacros,
  updateMacros,

  createDailyObject,

  getTodaysDailyKey,
  getPriorDaily,
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
