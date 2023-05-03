'use client'
import React from "react";
import Navbar from '@/ui/Navbar'
import { usePathname } from "next/navigation";
import { NAVIGATION_ROUTES_HOME, ROUTES_CONSOLE } from "@/diet/app/constants"
import { signInWithGoogle } from "@/auth-client/firebase/auth.api"
import { useRouter } from "next/navigation";

export default function Page() {
  const pathname = usePathname()
  const router = useRouter()

  const signIn = async () => {
    try {
      await signInWithGoogle();
      console.log('route to google',);
      router.push(ROUTES_CONSOLE.console)
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Navbar
        signIn={signIn}
        navigation={NAVIGATION_ROUTES_HOME}
        pathname={pathname}
      />
      <h1>This is the main page</h1>
    </>
  )

}
