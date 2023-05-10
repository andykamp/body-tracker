import React from "react";
import { useAuthContext } from '@/auth-client/firebase/auth.context'
import { useRouter } from "next/navigation";

export function useAuthRedirect() {
  const { user } = useAuthContext()
  const router = useRouter()

  React.useEffect(() => {
    if (user == null) router.push("/login")
  }, [user])

  return user
}

