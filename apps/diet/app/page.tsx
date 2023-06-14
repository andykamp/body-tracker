'use client'
import React from "react";
import Navbar from '@/ui/Navbar'
import { usePathname } from "next/navigation";
import { NAVIGATION_ROUTES_HOME, ROUTES_CONSOLE } from "@/diet/app/constants"
import { useRouter } from "next/navigation";
import Page from "@/ui/Page";

function HomePage() {
  const pathname = usePathname()
  const router = useRouter()

  const goToSignin = async () => {
    router.push(ROUTES_CONSOLE.login)
  };

  return (
    <Page>
      <Navbar
        signIn={goToSignin}
        navigation={NAVIGATION_ROUTES_HOME}
        pathname={pathname}
      />
      <h1>This is the main page</h1>
    </Page>
  )

}

export default HomePage
