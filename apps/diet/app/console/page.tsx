'use client'
import React, { useEffect } from "react";
import { useAuthRedirect } from "../../utils/auth.utils";
import Navbar from '@/ui/Navbar'
import { usePathname } from "next/navigation";
import { NAVIGATION_ROUTES_CONSOLE, ROUTES_CONSOLE } from "@/diet/app/constants"
import { useRouter } from "next/navigation";
import Page from "@/ui/Page";
import DailyPage from "./daily/page";
import MealsAndProductsPage from "./mealsAndProducts/page";
import ProfilePage from "./profile/page";
import { signInWithGoogle, signOutOfGoogle, deleteAccount } from '@/diet/utils/auth.utils'
import {
  useQueryClient,
} from '@tanstack/react-query'

function ConsolePage() {
  const user = useAuthRedirect()
  const pathname = usePathname()
  const router = useRouter()

  // make sure we reset the cache when logged out
  // if not the next user will se prev users data
  const queryClient = useQueryClient()
  useEffect(() => {
    return () => {
      console.log('Unmounting console',);
      queryClient.removeQueries()
    }

  }, []);

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
    <>
      <Navbar
        user={user}
        signIn={signIn}
        signOut={signOut}
        deleteAccount={deleteGoogleAccount}
        navigation={NAVIGATION_ROUTES_CONSOLE}
        pathname={pathname}
      />
      <Page>
        <h1>Only logged in users can view this page</h1>
        <div className="flex gap-2 bg-red">
          <DailyPage />
          <MealsAndProductsPage />
          <ProfilePage />
        </div>
      </Page>
    </>
  )
}

export default ConsolePage;
