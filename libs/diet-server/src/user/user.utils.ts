import * as t from "@/diet-server/diet.types"

export function createUser(userId: string): t.User {
 return {
    id: userId,
    products: {},
    meals: {},
    targetCalories: 0,
    targetProteins: 0,
  }
}

