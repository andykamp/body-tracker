import React from "react";
import Navbar from '@/ui/Navbar'
import { usePathname } from "next/navigation";
import { NAVIGATION_ROUTES_CONSOLE, ROUTES_CONSOLE } from "@/diet/app/constants"
import { useRouter } from "next/navigation";
import Page from "@/ui/Page";
import Daily from "@/diet/components/Daily";
import MealsAndProducts from "@/diet/components/MealsAndProducts";
import Profile from "@/diet/components/Profile";
import { signInWithGoogle, signOutOfGoogle, deleteAccount } from '@/diet/utils/auth.utils'
import { Fieldset } from "@geist-ui/core";
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
  const handler = (e: any) => {
  }

  return (

    <>
      <Navbar
        user={authUser}
        signIn={signIn}
        signOut={signOut}
        deleteAccount={deleteGoogleAccount}
        navigation={NAVIGATION_ROUTES_CONSOLE}
        pathname={pathname}
      />
      <Page>
        <h1>Only logged in users can view this page</h1>
        <Fieldset.Group value="Daily" onChange={handler}>
          <Fieldset label="Daily">
            <Fieldset.Title>Daily</Fieldset.Title>
            <Fieldset.Subtitle>Showing you all daily goodies</Fieldset.Subtitle>
            <Daily />
          </Fieldset>
          <Fieldset label="Meals and products">
            <Fieldset.Title>Meals and products</Fieldset.Title>
            <Fieldset.Subtitle>Meals and product goodies</Fieldset.Subtitle>
            <MealsAndProducts />
          </Fieldset>
          {/*
          <Fieldset label="Profile">
            <Fieldset.Title>Profile</Fieldset.Title>
            <Fieldset.Subtitle>Profile goodies</Fieldset.Subtitle>
            <Profile />
          </Fieldset>
          */}
        </Fieldset.Group>
      </Page>
    </>
  )
}

export default ConsolePage;

