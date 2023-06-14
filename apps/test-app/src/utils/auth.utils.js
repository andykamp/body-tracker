import React from "react";
import { useAuthContext } from '@/auth-client/firebase/Provider'
import { useRouter } from "next/navigation";
import authApi from "@/auth/firebase/auth.api"
import userApi from "@/diet-server/user/user.api";

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
      await userApi.addUser({ uid: result.user.uid })
    }
  });
}

export async function signOutOfGoogle() {
  await authApi.signOutOfGoogle({});
}

export async function deleteAccount(user) {
  await userApi.delete({ uid: user.uid })
  await authApi.deleteAccount({});
}
