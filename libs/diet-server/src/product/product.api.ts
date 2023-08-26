import type * as t from "@/diet-server/diet.types"
import baseApi from "@/diet-server/base.api";
import { createProductObject, createProductObjectEmpty } from "@/diet-server/product/product.utils";
import { getISODate } from "@/diet-server/utils/date.utils";

function parseToValidProduct(product: t.Product): t.Product {
  if (!product.name) {
    throw new Error("Product name is required");
  }

  if (!product.protein && !product.calories) {
    throw new Error("At least one of protein or calories is required");
  }

  return productApi.createProductObject({
    name: product.name,
    description: product.description || "",
    protein: product.protein || 0,
    calories: product.calories || 0,
    grams: product.grams || 0,
  });
}

function hasReferences(product: t.Product): boolean {
  return hasReferenceToDaily(product) || hasReferenceToMeal(product)
}

function hasReferenceToDaily(product: t.Product): boolean {
  return product.referenceDailies && Object.keys(product.referenceDailies).length > 0
}

function getReferencesDaily(product: t.Product) {
  return product.referenceDailies
}

function hasReferenceToMeal(product: t.Product): boolean {
  return product.referenceMeals && Object.keys(product.referenceMeals).length > 0
}

function getReferencesMeal(product: t.Product) {
  return product.referenceMeals
}

function addReferenceToMeal(product: t.Product, mealId: string) {
  const newProduct = { ...product }
  if (!newProduct.referenceMeals) newProduct.referenceMeals = {}
  newProduct.referenceMeals[mealId] = true
  return newProduct
}

function removeReferenceToMeal(product: t.Product, mealId: string) {
  const newProduct = { ...product }
  delete newProduct.referenceMeals[mealId]
  return newProduct
}

function addReferenceToDaily(product: t.Product, dailyId: string) {
  const newProduct = { ...product }
  if (!newProduct.referenceDailies) newProduct.referenceDailies = {}
  newProduct.referenceDailies[dailyId] = true
  return newProduct
}

function removeReferenceToDaily(product: t.Product, dailyId: string) {
  const newProduct = { ...product }
  delete newProduct.referenceDailies[dailyId]
  return newProduct
}



type GetProductInput = {
  userId: string
  id: string
}

async function getProduct({ userId, id }: GetProductInput): Promise<t.Product> {
  const r = await baseApi.makeReqAndExec<t.Product>({
    proc: "getProduct",
    vars: {
      userId,
      id,
    }
  })
  return r

}

type GetProductsInput = {
  userId: string
}
async function getProducts({ userId }: GetProductsInput): Promise<t.Product[]> {
  const r = await baseApi.makeReqAndExec<t.Product>({
    proc: "getProducts",
    vars: { userId }
  })
  return r
}

type AddProductInput = {
  userId: string,
  product: t.Product
}
async function addProduct({ userId, product }: AddProductInput) {
  console.log('addproddddd',);
  const newProduct: t.Product = { ...product };
  await baseApi.makeReqAndExec<t.Product>({
    proc: "addProduct",
    vars: {
      userId,
      product: newProduct
    }
  })
  return product
}


type UpdateProductInput = {
  userId: string,
  updatedProduct: t.Product
}
async function updateProduct({ userId, updatedProduct }: UpdateProductInput) {
  const up = { ...updatedProduct, updatedAt: getISODate() }

  console.log('updateProduct', up);
  await baseApi.makeReqAndExec<t.Product>({
    proc: "updateProduct",
    vars: {
      userId,
      product: up
    }
  })
  return up
}

type UpdateProductAndReferencesInput = {
  userId: string,
  updatedProduct: t.Product
}

async function updateProductAndReferences({
  userId,
  updatedProduct
}: UpdateProductAndReferencesInput) {

  // productApi.updateProduct({ userId, updatedProduct })

  // // @todo: update all dependent meals
  // if (productApi.hasReferenceToMeal(updatedProduct)) {
  //   const references = productApi.getReferencesMeal(updatedProduct)
  //   for (const mealRef of Object.keys(references)) {
  //     // .. get the meal
  //     const meal = await mealApi.getMeal({ userId, id: mealRef })
  //     // ..update the meal
  //     const newMeal: t.Meal = { ...meal }
  //     newMeal.products = newMeal.products.map(i => i.id === updatedItem.id ? updatedItem : i);
  //     await mealApi.updateMeal({ userId, meal: newMeal })

  //   }
  // }
  // mealApi.updateReferencedMeals

  return updatedProduct
}

type SoftDeleteProductInput = {
  userId: string,
  product: t.Product,
}

async function softDeleteProduct({
  userId,
  product
}: SoftDeleteProductInput) {
  const updatedProduct: t.Product = { ...product, isDeleted: true }
  await productApi.updateProduct({
    userId,
    updatedProduct: updatedProduct
  })
  return updatedProduct
}

type RestoreDeletedProductInput = {
  userId: string,
  product: t.Product,
}

async function restoreDeletedProduct({
  userId,
  product
}: RestoreDeletedProductInput) {
  const updatedProduct: t.Product = { ...product, isDeleted: false }
  await productApi.updateProduct({
    userId,
    updatedProduct: updatedProduct
  })
  return updatedProduct
}

type DeleteProductInput = {
  userId: string,
  product: t.Product,
  fromDaily?: string
}
async function deleteProduct({
  userId,
  product,
  fromDaily
}: DeleteProductInput) {
  let productToDelete = fromDaily ? productApi.removeReferenceToDaily(product, fromDaily) : product

  // we cannot delete the product if it is referenced by a meal
  console.log('delteProd', productToDelete);
  if (productApi.hasReferences(productToDelete)) {
    return productApi.softDeleteProduct({ userId, product:productToDelete })
  } else {

    console.log('delete forever',);
    // if we have no reference we do not delete it
    await baseApi.makeReqAndExec<t.Product>({
      proc: "deleteProduct",
      vars: {
        userId,
        id: productToDelete.id,
      }
    })
    return productToDelete
  }
}


const productApi = {
  createProductObject,
  createProductObjectEmpty,
  parseToValidProduct,

  hasReferenceToMeal,
  hasReferenceToDaily,
  hasReferences,

  getReferencesMeal,
  getReferencesDaily,
  addReferenceToMeal,
  removeReferenceToMeal,
  addReferenceToDaily,
  removeReferenceToDaily,

  getProduct,
  getProducts,
  addProduct,
  updateProduct,
  updateProductAndReferences,
  deleteProduct,
  softDeleteProduct,
  restoreDeletedProduct,
};

export type ProductApi = typeof productApi;
export default productApi;
