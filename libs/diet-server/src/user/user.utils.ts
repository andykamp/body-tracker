import * as t from "@/diet-server/diet.types"

export function createUser(uid: string): t.User {
 return {
    id: uid,
    daily: {},
    products: {},
    meals: {},
    targetCalories: 0,
    targetProteins: 0,
  }
}

