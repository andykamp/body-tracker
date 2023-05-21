'use client'
import React from "react";
import Navbar from '@/ui/Navbar'
import { usePathname } from "next/navigation";
import { NAVIGATION_ROUTES_HOME, ROUTES_CONSOLE } from "@/diet/app/constants"
import { useRouter } from "next/navigation";
import { signInWithGoogle } from '@/diet/utils/auth.utils'
import Page from "@/ui/Page";

function HomePage() {
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
  return (
    <Page>
      <Navbar
        signIn={signIn}
        navigation={NAVIGATION_ROUTES_HOME}
        pathname={pathname}
      />
      <h1>This is the main page</h1>
    </Page>
  )

}

export default HomePage
