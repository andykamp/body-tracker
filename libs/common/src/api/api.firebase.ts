import * as t from "@/diet-server/diet.types";
import { doc, collection, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from '@/auth/firebase/config';
import { createUser } from "@/diet-server/user/user.utils";

type AddUserInput = {
  uid: string
}

export async function addUser({ uid }: AddUserInput): Promise<void> {
  const initialUserData: t.User = createUser(uid)
  return await setDoc(doc(db, "users", uid), initialUserData, { merge: true })
}

type DeleteUserInput = {
  uid: string
}

export async function deleteUser({ uid }: DeleteUserInput): Promise<void> {
  return await deleteDoc(doc(db, "users", uid))
}


type getMealsInput = {
  userId: string,
}
export async function getMeals({ userId }: getMealsInput): Promise<void> {
  const collectionRef = collection(db, `user/${userId}/meals`);
  const querySnapshot = await getDocs(collectionRef);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
  });

}

type getMealInput = {
  userId: string,
  name: string
}
export async function getMeal({ userId, name }: getMealInput): Promise<void> {
  const docRef = doc(db, `user/${userId}/meals/${name}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
}

type AddMealInput = {
  userId: string,
  meal: t.Meal
}

export async function addMeal({ userId, meal }: AddMealInput): Promise<void> {
  return await setDoc(doc(db, `user/${userId}/meals`, meal.name), meal)
}

type updateMealInput = {
  userId: string,
  meal: t.Meal
}

export async function updateMeal({ userId, meal }: updateMealInput): Promise<void> {
  return await updateDoc(doc(db, `user/${userId}/meals`, meal.name), meal)
}

type deleteMealInput = {
  userId: string,
  meal: t.Meal
}

export async function deleteMeal({ userId, meal }: deleteMealInput): Promise<void> {
  return await deleteDoc(doc(db, `user/${userId}/meals`, meal.name))
}



const firebaseApi = {
  addUser,
  deleteUser

}

export type FirebaseApi = typeof firebaseApi
export default firebaseApi
