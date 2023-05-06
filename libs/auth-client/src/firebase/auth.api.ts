import { auth } from '@/auth/firebase/config';
import { signInWithPopup, signOut, GoogleAuthProvider, getAdditionalUserInfo, deleteUser } from "firebase/auth";
import { addUser, deleteUser as deleteUserFromDatabase } from "@/diet-server/user/user.api";

const provider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider)
    // This gives you a Google Access Token. You can use it to access the Google API.
    const userInfo = getAdditionalUserInfo(result)
    console.log('userInfo', userInfo, userInfo.isNewUser);
    if (userInfo.isNewUser) {
      console.log('addingUser',);
      const r = await addUser(result.user.uid)
      console.log('r', r);
    }

    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
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

export async function deleteAccount() {
  const user = auth.currentUser;
  console.log('deleting account', user);

  try {
    const r = await deleteUserFromDatabase({ uid: user.uid })
    // database deleted
    console.log('database deleteed', r);

    await deleteUser(user)
    // User deleted.
    console.log('user deleted',);
  } catch (error) {
    // An error ocurred
    // ...
    console.log('erroer', error);
  }
}
