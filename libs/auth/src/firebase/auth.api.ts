import app, { auth, db } from '@/auth/firebase/config';
import { signInWithPopup, signOut, GoogleAuthProvider, getAdditionalUserInfo, deleteUser, UserCredential } from "firebase/auth";
import { Firestore } from 'firebase/firestore';

const provider = new GoogleAuthProvider();

function getApp() {
  return app
}

function getAuth() {
  return auth
}

function getDB(): Firestore {
  return db
}

type SignInWithGoogleInput = {
  onNewUser?: (result: UserCredential) => void,
  onError?: (error: any) => void,
}

async function signInWithGoogle({
  onNewUser,
  onError,
}: SignInWithGoogleInput) {
  try {
    const result = await signInWithPopup(auth, provider)
    // This gives you a Google Access Token. You can use it to access the Google API.
    const userInfo = getAdditionalUserInfo(result)
    if (userInfo?.isNewUser) {
      // do something with new user here
      onNewUser?.(result)
    }
  } catch (error) {
    console.error('Error logging in', error);
    onError?.(error)
  }
}

type SignOutOfGoogleInput = {
  onError?: (error: any) => void,
}

async function signOutOfGoogle({
  onError,
}: SignOutOfGoogleInput) {
  try {
    await signOut(auth)
  } catch (error: any) {
    console.error('error', error);
    onError?.(error)
  };
}

type DeleteAccountInput = {
  onError?: (error: any) => void,
}

async function deleteAccount({ onError }: DeleteAccountInput) {
  const user = auth.currentUser;
  if (!user) throw new Error('User not found')

  try {
    await deleteUser(user)
    // User deleted.
  } catch (error) {
    // An error ocurred
    // ...
    console.error('erroer', error);
    onError?.(error)
  }
}

const authApi = {
  getApp,
  getAuth,
  getDB,
  signInWithGoogle,
  signOutOfGoogle,
  deleteAccount
}
export type AuthApi = typeof authApi;
export default authApi;
