'use client'
import React from "react";
import { useAuthRedirect } from "../../utils/auth.utils";
import Navbar from '@/ui/Navbar'
import { usePathname } from "next/navigation";
import { NAVIGATION_ROUTES_CONSOLE, ROUTES_CONSOLE } from "@/diet/app/constants"
import { signInWithGoogle, signOutOfGoogle } from "@/auth-client/firebase/auth.api"
import { useRouter } from "next/navigation";

function Page() {
  const user = useAuthRedirect()
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

  return (
    <>
      <Navbar
        user={user}
        signIn={signIn}
        signOut={signOut}
        navigation={NAVIGATION_ROUTES_CONSOLE}
        pathname={pathname}
      />
      <h1>Only logged in users can view this page</h1>
    </>
  )
}

export default Page;
