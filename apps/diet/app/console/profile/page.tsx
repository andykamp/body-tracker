'use client'
import React from "react";
import Page from "@/ui/Page";
import { useAuthContext } from "@/auth-client/firebase/auth.context";
import { useUserContext } from "@/diet/utils/UserProvider";
import Weight from "@/diet/components/Weight";

function ProfilePage() {
  const { user: authUser } = useAuthContext()
  const { user } = useUserContext()

  return (
    <Page>
      <h1>Profile page!</h1>

      <h3>Google login user:</h3>
      <pre className="w-40 h-40 overflow-auto">{JSON.stringify(authUser, null, 2)}</pre>

      <h3>DB user:</h3>
      <pre className="w-40 h-40 overflow-auto">{JSON.stringify(user, null, 2)}</pre>
      <Weight/>
    </Page>
  )
}

export default ProfilePage;

