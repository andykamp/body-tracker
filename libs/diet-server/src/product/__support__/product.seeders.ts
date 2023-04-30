import * as t from "@/diet-server/diet.types"
import productApi from "@/diet-server/product/product.api";

export function seedProduct(data?: Partial<t.Product>) {
  return productApi.addProduct({
    name: "Product A",
    protein: 20,
    calories: 200,
    grams: 100,
    ...data,
  });
}

export function seedProductToUser(userId: string, data?: Partial<t.Product>) {
  return productApi.addProductToUser(userId, {
    name: "Product B",
    protein: 30,
    calories: 300,
    grams: 150,
    ...data,
  });
}

export function seedUpdateProduct(name: string, data?: Partial<t.Product>) {
  return productApi.updateProduct(name, {
    protein: 25,
    calories: 250,
    grams: 125,
    ...data,
  });
}

export function seedUpdateProductToUser(userId: string, name: string, data?: Partial<t.Product>) {
  return productApi.updateProductToUser(userId, name, {
    protein: 35,
    calories: 350,
    grams: 175,
    ...data,
  });
}

export function seedDeleteProduct(name: string) {
  return productApi.deleteProduct(name);
}

export function seedDeleteProductToUser(userId: string, name: string) {
  return productApi.deleteProductToUser(userId, name);
}

export default {
  seedProduct,
  seedProductToUser,
  seedUpdateProduct,
  seedUpdateProductToUser,
  seedDeleteProduct,
  seedDeleteProductToUser,
};

