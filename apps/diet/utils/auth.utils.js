import React from "react";
import { useAuthContext } from '@/auth-client/firebase/auth.context'
import { useRouter } from "next/navigation";
import authApi from "@/auth/firebase/auth.api"
import { addUser, deleteUser as deleteUserData } from "@/diet-server/user/user.api";

export function useAuthRedirect() {
  const { user } = useAuthContext()
  const router = useRouter()

  React.useEffect(() => {
    if (user == null) router.push("/login")
  }, [user])

  return user
}

export async function signInWithGoogle() {
  await authApi.signInWithGoogle({
    onNewUser: async (result) => {
      const r = await addUser({ uid: result.user.uid })
      console.log('new user added', r);
    }
  });
}

export async function signOutOfGoogle() {
  await authApi.signOutOfGoogle({});
}

export async function deleteAccount(user) {
  await deleteUserData({ uid: user.uid })
  await authApi.deleteAccount({});
}
