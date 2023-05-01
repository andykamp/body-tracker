import { auth } from '@/auth/firebase/config';
import { signInWithPopup, signOut, GoogleAuthProvider, getAdditionalUserInfo } from "firebase/auth";

const provider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider)
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    const userInfo = getAdditionalUserInfo(result)
    console.log('userInfo', token, user, userInfo);
  } catch (error) {
    // Handle Errors here.
    // const errorCode = error.code;
    // const errorMessage = error.message;
    // // The email of the user's account used.
    // const email = error.customData.email;
    // // The AuthCredential type that was used.
    // const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
    // const provider = new GoogleAuthProvider();
    console.log('Error logging in', error);
  }
}

export async function signOutOfGoogle() {
  try {
    await signOut(auth)
  } catch (error: any) {
    // An error happened.
    console.log('error', error);
  };
}
