import mealApi from "@/diet-server/meal/meal.api"
import productApi from "@/diet-server/product/product.api"

export function createProduct() {
  const product = productApi.createProductObject({
    name: `test_product_${Math.random()}`,
    protein: Math.floor(Math.random() * 201),
    calories: Math.floor(Math.random() * 201),
    grams: Math.floor(Math.random() * 201),
  })
  return product
}

export function createMeal() {
  const meal = mealApi.createMealObject({
    name: `test_product_${Math.random()}`,
    products: ["SmallMealsCottageCheeseWithPB"],
    protein: Math.floor(Math.random() * 201),
    calories: Math.floor(Math.random() * 201),
    grams: Math.floor(Math.random() * 201),
  })
  return meal
}


