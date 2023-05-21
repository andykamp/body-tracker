import type * as t from "./diet.types";
import { doc, collection, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import authApi from '@/auth/firebase/auth.api';
console.log('authApi', authApi);

const db = authApi.getDB()

type GetUserInput = {
  uid: string
}

export async function getUser({ uid }: GetUserInput): Promise<t.User | undefined> {
  const docRef = doc(db, "users", uid)
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return docSnap.data() as t.User
  } else {
    // docSnap.data() will be undefined in this case
    return
  }
}

// user
function createUser(uid: string): t.User {
  return {
    id: uid,
    daily: {},
    products: {},
    meals: {},
    targetCalories: 0,
    targetProteins: 0,
  }
}

type AddUserInput = {
  uid: string
}

export async function addUser({ uid }: AddUserInput): Promise<void> {
  const initialUserData: t.User = createUser(uid)
  return await setDoc(doc(db, "users", uid), initialUserData, { merge: true })
}

type UpdateUserInput = {
  uid: string
  user: Partial<t.User>
}

export async function updateUser({ uid, user }: UpdateUserInput): Promise<void> {
  return await updateDoc(doc(db, "users", uid), user)
}

type DeleteUserInput = {
  uid: string
}

export async function deleteUser({ uid }: DeleteUserInput): Promise<void> {
  return await deleteDoc(doc(db, "users", uid))
}


// meals


type getMealsInput = {
  userId: string,
}
export async function getMeals({ userId }: getMealsInput): Promise<t.Meal[]> {
  console.log('getMeals', userId);
  const collectionRef = collection(db, `users/${userId}/meals`);
  const querySnapshot = await getDocs(collectionRef);
  const out: t.Meal[] = []
  querySnapshot.forEach((doc) => {
    out.push(doc.data() as t.Meal)
  });

  return out

}

type getMealInput = {
  userId: string,
  name: string
}
export async function getMeal({ userId, name }: getMealInput): Promise<t.Meal | undefined> {
  const docRef = doc(db, `users/${userId}/meals/${name}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return docSnap.data() as t.Meal
  } else {
    // docSnap.data() will be undefined in this case
    return
  }
}

type AddMealInput = {
  userId: string,
  meal: t.Meal
}

export async function addMeal({ userId, meal }: AddMealInput): Promise<void> {
  return await setDoc(doc(db, `users/${userId}/meals`, meal.name), meal)
}

type updateMealInput = {
  userId: string,
  meal: t.Meal
}

export async function updateMeal({ userId, meal }: updateMealInput): Promise<void> {
  return await updateDoc(doc(db, `users/${userId}/meals`, meal.name), meal)
}

type deleteMealInput = {
  userId: string,
  name: string
}

export async function deleteMeal({ userId, name }: deleteMealInput): Promise<void> {
  return await deleteDoc(doc(db, `users/${userId}/meals`, name))
}


// products


type getProductsInput = {
  userId: string,
}
export async function getProducts({ userId }: getProductsInput): Promise<t.Product[]> {
  console.log('getProducts', userId);
  const collectionRef = collection(db, `users/${userId}/products`);
  const querySnapshot = await getDocs(collectionRef);
  const out: t.Product[] = []
  querySnapshot.forEach((doc) => {
    out.push(doc.data() as t.Product)
  });

  return out

}

type getProductInput = {
  userId: string,
  name: string
}
export async function getProduct({ userId, name }: getProductInput): Promise<t.Product | undefined> {
  const docRef = doc(db, `users/${userId}/products/${name}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return docSnap.data() as t.Product
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
    return
  }
}

type AddProductInput = {
  userId: string,
  product: t.Product
}

export async function addProduct({ userId, product }: AddProductInput): Promise<void> {
  console.log('addproduct', userId, product);
  return await setDoc(doc(db, `users/${userId}/products`, product.name), product)
}

type updateProductInput = {
  userId: string,
  product: t.Product
}

export async function updateProduct({ userId, product }: updateProductInput): Promise<void> {
  return await updateDoc(doc(db, `users/${userId}/products`, product.name), product)
}

type deleteProductInput = {
  userId: string,
  name: string
}

export async function deleteProduct({ userId, name }: deleteProductInput): Promise<void> {
  return await deleteDoc(doc(db, `users/${userId}/products`, name))
}


// daily


type getDailyInput = {
  userId: string,
  dateKey: string
}

export async function getDaily({ userId, dateKey }: getDailyInput): Promise<t.DailyDiet | undefined> {
  const docRef = doc(db, `users/${userId}/dailies/${dateKey}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return docSnap.data() as t.DailyDiet
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
    return
  }
}

type getDailiesInput = {
  userId: string,
}

export async function getDailies({ userId }: getDailiesInput): Promise<t.DailyDiet[]> {
  const collectionRef = collection(db, `users/${userId}/dailies`);
  const querySnapshot = await getDocs(collectionRef);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
  const out: t.DailyDiet[] = []
  querySnapshot.forEach((doc) => {
    out.push(doc.data() as t.DailyDiet)
  });

  return out
}

type addDailyInput = {
  userId: string,
  daily: t.DailyDiet
}

export async function addDaily({ userId, daily }: addDailyInput): Promise<void> {
  return await setDoc(doc(db, `users/${userId}/dailies`, daily.id), daily)
}

type updateDailyInput = {
  userId: string,
  daily: Partial<t.DailyDiet> & { id: string }
}

export async function updateDaily({ userId, daily }: updateDailyInput): Promise<void> {
  console.log('updateDAily', userId, daily);
  return await updateDoc(doc(db, `users/${userId}/dailies`, daily.id), daily)
}

type deleteDailyInput = {
  userId: string,
  daily: t.DailyDiet
}

export async function deleteDaily({ userId, daily }: deleteDailyInput): Promise<void> {
  return await deleteDoc(doc(db, `users/${userId}/dailies`, daily.id))
}

const firebaseApi = {
  addUser,
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

export type FirebaseApi = typeof firebaseApi
export default firebaseApi
