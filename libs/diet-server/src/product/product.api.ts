import type * as t from "@/diet-server/diet.types"
import * as f from "@/diet-server/product/__support__/product.fixtures";
import { USERS_FIXTURE } from "@/diet-server/user/__support__/user.fixtures";

const USERS: t.Users = USERS_FIXTURE;

const products: t.Products = f.PRODUCTS_FIXTURE;

export function getValidProduct(product: t.Product): t.Product {
  if (!product.name) {
    throw new Error("Product name is required");
  }

  if (!product.protein && !product.calories) {
    throw new Error("At least one of protein or calories is required");
  }

  return {
    name: product.name,
    protein: product.protein || 0,
    calories: product.calories || 0,
    grams: product.grams,
  };
}

export function addProduct(input: t.Product): t.ResponseResult {
  const newProduct: t.Product = getValidProduct(input); 

  const key = input.name

  if (products[key]) {
    return {
      success: false,
      message: "Product already exists",
    };
  }

  products[key] = newProduct;
  return {
    success: true,
    message: "Product added successfully",
  };
}

export function addProductToUser(userId: string, input: t.Product): t.ResponseResult {
  const newProduct: t.Product = { ...input };

  if (!USERS[userId]) {
    return {
      success: false,
      message: "User does not exists",
    };
  }

  const key = input.name

  if (USERS[userId].products[key]) {
    return {
      success: false,
      message: "Product already exists",
    };
  }

  USERS[userId].products[key] = newProduct;
  return {
    success: true,
    message: "Product added successfully",
  };
}

export function updateProduct(key: string, input: Partial<t.Product>): t.ResponseResult {
  if (!products[key]) {
    return {
      success: false,
      message: "Product not found",
    };
  }

  products[key] = { ...products[key], ...input };
  return {
    success: true,
    message: "Product updated successfully",
  };
}

export function updateProductToUser(userId: string, key: string, input: Partial<t.Product>): t.ResponseResult {
  if (!USERS[userId] || !USERS[userId].products[key]) {
    return {
      success: false,
      message: "Product not found",
    };
  }

  USERS[userId].products[key] = { ...USERS[userId].products[key], ...input };
  return {
    success: true,
    message: "Product updated successfully",
  };
}

export function deleteProduct(key: string): t.ResponseResult {
  if (!products[key]) {
    return {
      success: false,
      message: "Product not found",
    };
  }

  delete products[key];
  return {
    success: true,
    message: "Product deleted successfully",
  };
}

export function deleteProductToUser(userId: string, key: string): t.ResponseResult {
  if (!USERS[userId] || !USERS[userId].products[key]) {
    return {
      success: false,
      message: "Product not found",
    };
  }

  delete USERS[userId].products[key];
  return {
    success: true,
    message: "Product deleted successfully",
  };
}

const productApi = {
  // getProduct,
  // getProductToUser,
  // getProducts,
  // getProductsToUser,
  getValidProduct,
  addProductToUser,
  addProduct,
  deleteProduct,
  deleteProductToUser,
  updateProduct,
  updateProductToUser,
};

export type ProductApi = typeof productApi;
export default productApi;
