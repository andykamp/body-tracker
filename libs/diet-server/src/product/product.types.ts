import * as t from "@/diet-server/diet.types";

export type GetProductInput = {
  userId: string
  id: string
}

export type GetProductsInput = {
  userId: string
}

export type AddProductInput = {
  userId: string,
  product: t.Product
}

export type UpdateProductInput = {
  userId: string,
  updatedProduct: t.Product
}

export type UpdateProductAndReferencesInput = {
  userId: string,
  updatedProduct: t.Product
}

export type SoftDeleteProductInput = {
  userId: string,
  product: t.Product,
}

export type RestoreDeletedProductInput = {
  userId: string,
  product: t.Product,
}

export type DeleteProductInput = {
  userId: string,
  product: t.Product,
  fromDaily?: string
}
