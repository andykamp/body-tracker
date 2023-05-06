import * as t from "@/diet-server/diet.types";
import { doc, setDoc } from "firebase/firestore";
import { db } from '@/auth/firebase/config';
import { createUser } from "@/diet-server/user/user.utils";

type AddUserInput = {
  uid: string
}
export async function addUser({ uid }: AddUserInput): Promise<void> {

  const initialUserData: t.User = createUser(uid)

  console.log('addingUser', uid, initialUserData);
  return await setDoc(doc(db, "users", uid), initialUserData, { merge: true })
}

const firebaseApi = {
  addUser,

}

export type FirebaseApi = typeof firebaseApi
export default firebaseApi
