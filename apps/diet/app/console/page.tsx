'use client'
import { AuthContextProvider } from '@/auth-client/firebase/AuthContext'
import { UserContextProvider } from "@/user-client/Provider";
import { WithingsContextProvider } from '@/withings-client/Provider'
import { OuraContextProvider } from '@/oura-client/Provider'
import ConsolePage from '@/diet/components/ConsolePage'


export default function RootLayout() {
  return (
    <AuthContextProvider>
      <UserContextProvider>
        <WithingsContextProvider>
          <OuraContextProvider>
            <ConsolePage />
          </OuraContextProvider>
        </WithingsContextProvider>
      </UserContextProvider>
    </AuthContextProvider>
  )
}

