import type * as t from "@/diet-server/diet.types";
import crudApi from "@/common/crud/crud.firebase";
import authApi from '@/auth/firebase/auth.api';

// initilize database
const db = authApi.getDB()
crudApi.initializeDB(db);

//
// User
//

export async function getUser({ uid }: { uid: string }): Promise<t.User | undefined> {
  return crudApi.readDocument<t.User>("users", uid);
}

export async function addUser({ uid, initialUserData }: { uid: string, initialUserData:t.User }): Promise<void> {
  return crudApi.createDocument("users", uid, initialUserData);
}

export async function updateUser({ uid, user }: { uid: string; user: Partial<t.User> }): Promise<void> {
  return crudApi.updateDocument("users", uid, user);
}

export async function deleteUser({ uid }: { uid: string }): Promise<void> {
  return crudApi.deleteDocument("users", uid);
}

//
// Meals
//

export async function getMeals({ userId }: { userId: string }): Promise<t.MealMinimal[]> {
  return crudApi.readCollection<t.MealMinimal>(`users/${userId}/meals`);
}

export async function getMeal({ userId, id }: { userId: string; id: string }): Promise<t.MealMinimal | undefined> {
  return crudApi.readDocument<t.MealMinimal>(`users/${userId}/meals`, id);
}

export async function addMeal({ userId, meal }: { userId: string; meal: t.MealMinimal }): Promise<void> {
  return crudApi.createDocument(`users/${userId}/meals`, meal.id, meal);
}

export async function updateMeal({ userId, meal }: { userId: string; meal: t.MealMinimal }): Promise<void> {
  return crudApi.updateDocument(`users/${userId}/meals`, meal.id, meal);
}

export async function deleteMeal({ userId, id }: { userId: string; id: string }): Promise<void> {
  return crudApi.deleteDocument(`users/${userId}/meals`, id);
}

//
// Products
//

export async function getProducts({ userId }: { userId: string }): Promise<t.Product[]> {
  return crudApi.readCollection<t.Product>(`users/${userId}/products`);
}

export async function getProduct({ userId, id }: { userId: string; id: string }): Promise<t.Product | undefined> {
  return crudApi.readDocument<t.Product>(`users/${userId}/products`, id);
}

export async function addProduct({ userId, product }: { userId: string; product: t.Product }): Promise<void> {
  return crudApi.createDocument(`users/${userId}/products`, product.id, product);
}

export async function updateProduct({ userId, product }: { userId: string; product: t.Product }): Promise<void> {
  return crudApi.updateDocument(`users/${userId}/products`, product.id, product);
}

export async function deleteProduct({ userId, id }: { userId: string; id: string }): Promise<void> {
  return crudApi.deleteDocument(`users/${userId}/products`, id);
}

//
// Daily
//

export async function getDailies({ userId }: { userId: string }): Promise<t.DailyDiet[]> {
  return crudApi.readCollection<t.DailyDiet>(`users/${userId}/dailies`);
}

export async function getDaily({ userId, dateKey }: { userId: string; dateKey: string }): Promise<t.DailyDiet | undefined> {
  return crudApi.readDocument<t.DailyDiet>(`users/${userId}/dailies`, dateKey);
}

export async function addDaily({ userId, daily }: { userId: string; daily: t.DailyDiet }): Promise<void> {
  return crudApi.createDocument(`users/${userId}/dailies`, daily.id, daily);
}

export async function updateDaily({ userId, daily }: { userId: string; daily: Partial<t.DailyDiet> & { id: string } }): Promise<void> {
  return crudApi.updateDocument(`users/${userId}/dailies`, daily.id, daily);
}

export async function deleteDaily({ userId, id }: { userId: string; id: string }): Promise<void> {
  return crudApi.deleteDocument(`users/${userId}/dailies`, id);
}


const firebaseCrudApi = {
  getUser,
  addUser,
  updateUser,
  deleteUser,
  getMeals,
  getMeal,
  addMeal,
  updateMeal,
  deleteMeal,
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  getDaily,
  getDailies,
  addDaily,
  updateDaily,
  deleteDaily,
}

export type FirebaseCrudApi = typeof firebaseCrudApi
export default firebaseCrudApi
