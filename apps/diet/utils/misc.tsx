import mealApi from "@/diet-server/meal/meal.api"
import productApi from "@/diet-server/product/product.api"
import type { DebounceSettings, ThrottleSettings } from "lodash"
import debounce from "lodash.debounce"
import throttle from "lodash.throttle"
import { useRef } from "react"

export function createEmptyProduct(fromCustomMeal = false) {
  const product = productApi.createProductObject({
    name: '',
    fromCustomMeal
  })
  return product
}

export function createEmptyMeal() {
  const meal = mealApi.createMealObject({
    name: '',
    products: []
  })
  return meal
}

type Cb = (...args: any[]) => any

export function useDebounce(cb: Cb, t = 350, options?: DebounceSettings) {
  return useRef(debounce(cb, t, options)).current
}

export function useThrottle(cb: Cb, t = 350, options?: ThrottleSettings) {
  return useRef(throttle(cb, t, options)).current
}
