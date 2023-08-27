import type * as t from "@/diet-server/diet.types"
import type * as pt from "@/diet-server/product/product.types"
import baseApi from "@/diet-server/base.api";
import { createProductObject, createProductObjectEmpty } from "@/diet-server/product/product.utils";
import { getISODate } from "@/diet-server/utils/date.utils";

function parseToValidProduct(
  product: t.Product
): t.Product {

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

function hasReferences(
  product: t.Product
): boolean {
  return hasReferenceToDaily(product) || hasReferenceToMeal(product)
}

function hasReferenceToDaily(
  product: t.Product
): boolean {
  return product.referenceDailies && Object.keys(product.referenceDailies).length > 0
}

function getReferencesDaily(
  product: t.Product
) {
  return product.referenceDailies
}

function hasReferenceToMeal(
  product: t.Product
): boolean {
  return product.referenceMeals && Object.keys(product.referenceMeals).length > 0
}

function getReferencesMeal(
  product: t.Product
) {
  return product.referenceMeals
}

function addReferenceToMeal(
  product: t.Product,
  mealId: string
) {
  const newProduct = { ...product }
  if (!newProduct.referenceMeals) newProduct.referenceMeals = {}
  newProduct.referenceMeals[mealId] = true
  return newProduct
}

function removeReferenceToMeal(
  product: t.Product,
  mealId: string
) {
  const newProduct = { ...product }
  delete newProduct.referenceMeals[mealId]
  return newProduct
}

function addReferenceToDaily(
  product: t.Product,
  dailyId: string
) {
  const newProduct = { ...product }
  if (!newProduct.referenceDailies) newProduct.referenceDailies = {}
  newProduct.referenceDailies[dailyId] = true
  return newProduct
}

function removeReferenceToDaily(
  product: t.Product,
  dailyId: string
) {
  const newProduct = { ...product }
  delete newProduct.referenceDailies[dailyId]
  return newProduct
}

async function getProduct({
  userId,
  id
}: pt.GetProductInput){

  const r = await baseApi.makeReqAndExec<t.Product>({
    proc: "getProduct",
    vars: {
      userId,
      id,
    }
  })
  return r
}

async function getProducts({
  userId
}: pt.GetProductsInput){

  const r = await baseApi.makeReqAndExec<t.Product>({
    proc: "getProducts",
    vars: { userId }
  })
  return r
}

async function addProduct({
  userId,
  product
}: pt.AddProductInput) {

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


async function updateProduct({
  userId,
  updatedProduct
}: pt.UpdateProductInput) {

  const up = { ...updatedProduct, updatedAt: getISODate() }

  await baseApi.makeReqAndExec<t.Product>({
    proc: "updateProduct",
    vars: {
      userId,
      product: up
    }
  })
  return up
}

async function softDeleteProduct({
  userId,
  product
}: pt.SoftDeleteProductInput) {

  const updatedProduct: t.Product = { ...product, isDeleted: true }

  await productApi.updateProduct({
    userId,
    updatedProduct: updatedProduct
  })
  return updatedProduct
}

async function restoreDeletedProduct({
  userId,
  product
}: pt.RestoreDeletedProductInput) {

  const updatedProduct: t.Product = { ...product, isDeleted: false }

  await productApi.updateProduct({
    userId,
    updatedProduct: updatedProduct
  })
  return updatedProduct
}

async function deleteProduct({
  userId,
  product,
  fromDaily
}: pt.DeleteProductInput) {

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
  deleteProduct,
  softDeleteProduct,
  restoreDeletedProduct,
};

export type ProductApi = typeof productApi;
export default productApi;
