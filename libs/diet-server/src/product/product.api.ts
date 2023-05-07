import type * as t from "@/diet-server/diet.types"
import baseApi from "@/common/api/api.base";

export function parseToValidProduct(product: t.Product): t.Product {
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
    createdAt: product.createdAt || new Date(),
  };
}


export async function getStockProducts(): Promise<t.Products> {
  const r = await baseApi.makeReqAndExec<t.Product>({
    proc: "getStockProducts",
    vars: {}
  })
  return r
}


type GetProductInput = {
  userId: string
  name: string
}

export async function getProduct({ userId, name }: GetProductInput): Promise<t.Product> {
  const r = await baseApi.makeReqAndExec<t.Product>({
    proc: "getProduct",
    vars: {
      userId,
      name,
    }
  })
  return r

}

type GetProductsInput = {
  userId: string
}
export async function getProducts({ userId }: GetProductsInput): Promise<t.Product[]> {
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
export async function addProduct({ userId, product }: AddProductInput): Promise<t.ResponseResult> {
  const newProduct: t.Product = { ...product };

  try {
    const r = await baseApi.makeReqAndExec<t.Product>({
      proc: "addProduct",
      vars: {
        userId,
        product: newProduct
      }
    })
    return {
      success: true,
      message: "Product added successfully",
    };
  } catch (e) {
    return {
      success: false,
      message: "Product already exists",
    };
  }
}


type UpdateProductInput = {
  userId: string,
  name: string
  updatedProduct: Partial<t.Product>
}
export async function updateProduct({ userId, name, updatedProduct }: UpdateProductInput): Promise<t.ResponseResult> {

  try {
    const r = await baseApi.makeReqAndExec<t.Product>({
      proc: "updateProduct",
      vars: {
        userId,
        name,
        product: updatedProduct
      }
    })
    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (e) {
    return {
      success: false,
      message: "Product update error",
    };
  }
}

type DeleteProductInput = {
  userId: string,
  name: string
}
export async function deleteProduct({ userId, name }: DeleteProductInput): Promise<t.ResponseResult> {
  try {
    const r = await baseApi.makeReqAndExec<t.Product>({
      proc: "deleteProduct",
      vars: {
        userId,
        name,
      }
    })
    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (e) {
    return {
      success: false,
      message: "Product update error",
    };
  }
}

const productApi = {
  parseToValidProduct,
  getStockProducts,
  getProduct,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};

export type ProductApi = typeof productApi;
export default productApi;
