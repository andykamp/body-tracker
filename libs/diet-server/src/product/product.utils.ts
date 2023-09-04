import { v4 as uuid } from 'uuid';
import * as t from "@/diet-server/diet.types";
import { ITEM_TYPES } from '@/diet-server/diet.constants'
import { getISODate } from "@/diet-server/utils/date.utils";

export type CreateProductObjectInput = {
  name: string;
  description?: string;
  protein?: number;
  calories?: number;
  grams?: number;
  isStockItem?: boolean;
  fromCustomMeal?: boolean;
  fromCustomDaily?: boolean;
  referenceMeals?: t.References;
  referenceDailies?: t.References;
};

export function createProductObject({
  name,
  description = "",
  protein = 0,
  calories = 0,
  grams = 0,
  isStockItem = false,
  fromCustomMeal = false,
  fromCustomDaily = false,
  referenceMeals,
  referenceDailies,
}: CreateProductObjectInput): t.Product {
  const product: t.Product = {
    id: uuid(),
    type: ITEM_TYPES.PRODUCT,
    name,
    description,
    protein,
    calories,
    grams,

    isStockItem,
    fromCustomMeal,
    fromCustomDaily,

    createdAt: getISODate(),
    updatedAt: undefined,
    referenceMeals,
    referenceDailies,
  };

  return product;
}

type CreateProductObjectEmptyInput = {
  fromCustomMeal?: boolean;
  fromCustomDaily?: boolean;
}
export function createProductObjectEmpty(
  props?: CreateProductObjectEmptyInput
) {
  const product = createProductObject({
    name: '',
    fromCustomMeal: props?.fromCustomMeal || false,
    fromCustomDaily: props?.fromCustomDaily || false,
  })
  return product
}

// @todo: remove
export function parseToValidProduct(
  product: t.Product
): t.Product {

  if (!product.name) {
    throw new Error("Product name is required");
  }

  if (!product.protein && !product.calories) {
    throw new Error("At least one of protein or calories is required");
  }

  return createProductObject({
    name: product.name,
    description: product.description || "",
    protein: product.protein || 0,
    calories: product.calories || 0,
    grams: product.grams || 0,
  });
}

export function hasReferences(
  product: t.Product
): boolean {
  return hasReferenceToDaily(product) || hasReferenceToMeal(product)
}

export function hasReferenceToDaily(
  product: t.Product
): boolean {
  return product.referenceDailies && Object.keys(product.referenceDailies).length > 0
}

export function getReferencesDaily(
  product: t.Product
) {
  return product.referenceDailies
}

export function hasReferenceToMeal(
  product: t.Product
): boolean {
  return product.referenceMeals && Object.keys(product.referenceMeals).length > 0
}

export function getReferencesMeal(
  product: t.Product
) {
  return product.referenceMeals
}

export function addReferenceToMeal(
  product: t.Product,
  mealId: string
) {
  const newProduct = { ...product }
  if (!newProduct.referenceMeals) newProduct.referenceMeals = {}
  newProduct.referenceMeals[mealId] = true
  return newProduct
}

export function removeReferenceToMeal(
  product: t.Product,
  mealId: string
) {
  const newProduct = { ...product }
  if (newProduct.referenceMeals) {
    delete newProduct.referenceMeals[mealId]
  }
  return newProduct
}

export function addReferenceToDaily(
  product: t.Product,
  dailyId: string
) {
  const newProduct = { ...product }
  if (!newProduct.referenceDailies) newProduct.referenceDailies = {}
  newProduct.referenceDailies[dailyId] = true
  return newProduct
}

export function removeReferenceToDaily(
  product: t.Product,
  dailyId: string
) {
  const newProduct = { ...product }
  if (newProduct.referenceDailies) {
    delete newProduct.referenceDailies[dailyId]
  }
  return newProduct
}

