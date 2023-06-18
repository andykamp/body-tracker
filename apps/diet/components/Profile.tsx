import React from "react";
import { useAuthContext } from '@/auth-client/firebase/Provider'
import { useUserContext } from "@/user-client/Provider";
import WithingsGetAccess from "@/withings-client/GetAccess";
import WithingsWeight from "@/withings-client/graph/WithingsWeight";
import WithingsBodyComposition from "@/withings-client/graph/WithingsBodyComposition";
import OuraGetAccess from "@/oura-client/GetAccess";
import OuraSleep from "@/oura-client/graph/OuraSleep";
import OuraSleepAvg from "@/oura-client/graph/OuraSleepAvg";

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
      <WithingsGetAccess/>
      <WithingsWeight/>
      <WithingsBodyComposition/>
      <h3>Oura API</h3>
      <OuraGetAccess/>
      <OuraSleep/>
      <OuraSleepAvg/>
    </div>
  )
}

export default ProfilePage;

