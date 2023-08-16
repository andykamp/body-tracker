import type * as t from "@/diet-server/diet.types"
import baseApi from "@/diet-server/base.api";
import { createProductObject, createProductObjectEmpty } from "@/diet-server/product/product.utils";

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

function hasReferenceToMeal(product: t.Product): boolean {
  return product.referenceMeals && Object.keys(product.referenceMeals).length > 0
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
  // @todo: update all dependent meals
  console.log('updateProduct', updatedProduct);
  await baseApi.makeReqAndExec<t.Product>({
    proc: "updateProduct",
    vars: {
      userId,
      product: updatedProduct
    }
  })
  // @todo: update all dependent meals
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
}
async function deleteProduct({
  userId,
  product
}: DeleteProductInput) {
  // we cannot delete the product if it is referenced by a meal
  console.log('delteProd', product);
  if (productApi.hasReferences(product)) {
    return productApi.softDeleteProduct({ userId, product })
  } else {

    console.log('delete forever',);
    // if we have no reference we do not delete it
    await baseApi.makeReqAndExec<t.Product>({
      proc: "deleteProduct",
      vars: {
        userId,
        id: product.id,
      }
    })
    return product
  }
}

type updateReferencedMealsInput = {
  userId: string,
  updatedProduct: t.Product
}
async function updateReferencedMeals({ userId, updatedProduct }: updateReferencedMealsInput): Promise<t.Product> {
  // @todo: update all dependent meals and dailies
  console.log('updateProduct', updatedProduct);
  await baseApi.makeReqAndExec<t.Product>({
    proc: "updateProduct",
    vars: {
      userId,
      product: updatedProduct
    }
  })
  return updatedProduct
}


const productApi = {
  createProductObject,
  createProductObjectEmpty,
  parseToValidProduct,

  hasReferenceToMeal,
  hasReferenceToDaily,
  hasReferences,

  getProduct,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  softDeleteProduct,
  restoreDeletedProduct,

  updateReferencedMeals

};

export type ProductApi = typeof productApi;
export default productApi;
