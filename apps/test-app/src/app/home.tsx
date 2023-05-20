'use client'
import React from "react";
import Navbar from '@/ui/Navbar'
import { usePathname } from "next/navigation";
import { NAVIGATION_ROUTES_HOME } from "../constants"
import { signInWithGoogle } from "@/auth/firebase/auth.api"
import Page from "@/ui/Page";

function HomePage() {
  const pathname = usePathname()

  const signIn = async () => {
    try {
      await signInWithGoogle();
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
