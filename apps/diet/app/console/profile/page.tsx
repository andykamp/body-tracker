'use client'
import React from "react";
import { useAuthContext } from "@/auth-client/firebase/auth.context";
import { useUserContext } from "@/diet/utils/UserProvider";
import WithingsAccessCodeLink from "@/withings-client/AccessCodeLink";
import WithingsWeight from "@/diet/components/withings/WithingsWeight";
import WithingsBodyComposition from "@/diet/components/withings/WithingsBodyComposition";

function ProfilePage() {
  const { user: authUser } = useAuthContext()
  const { user } = useUserContext()

  return (
    <div>
      <h3>Google login user:</h3>
      <pre className="w-full h-40 overflow-auto">{JSON.stringify(authUser, null, 2)}</pre>

      <h3>DB user:</h3>
      <pre className="w-full h-40 overflow-auto">{JSON.stringify(user, null, 2)}</pre>

      <h3>Withings API</h3>
      <WithingsAccessCodeLink/>
      <WithingsWeight/>
      <WithingsBodyComposition/>
    </div>
  )
}

export default ProfilePage;

