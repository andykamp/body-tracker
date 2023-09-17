import React from "react";
import Navbar from '@/ui/Navbar'
import { usePathname } from "next/navigation";
import { NAVIGATION_ROUTES_CONSOLE, ROUTES_CONSOLE } from "@/diet/app/constants"
import { useRouter } from "next/navigation";
import { signInWithGoogle, signOutOfGoogle, deleteAccount } from '@/common-client/utils/auth.utils'
import { useAuthContext } from "@/auth-client/firebase/Provider";
import { useUserContext } from "@/user-client/Provider";

function ConsolePage() {
  const { user: authUser } = useAuthContext()
  const { user } = useUserContext()
  const pathname = usePathname()
  const router = useRouter()

  const signIn = async () => {
    try {
      await signInWithGoogle();
      router.push(ROUTES_CONSOLE.console)
    } catch (error) {
      console.error(error);
    }
  };
  const signOut = async () => {
    try {
      await signOutOfGoogle();
      router.push(ROUTES_CONSOLE.home)
    } catch (error) {
      console.error(error);
    }
  };
  const deleteGoogleAccount = async () => {
    try {
      await deleteAccount(user);
      router.push(ROUTES_CONSOLE.home)
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Navbar
      user={authUser}
      signIn={signIn}
      signOut={signOut}
      deleteAccount={deleteGoogleAccount}
      navigation={NAVIGATION_ROUTES_CONSOLE}
      pathname={pathname}
      onNavigate={router.push}
    />
  )
}

export default ConsolePage;


