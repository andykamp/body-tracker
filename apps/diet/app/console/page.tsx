'use client'
import { AuthContextProvider } from '@/auth-client/firebase/Provider'
import { UserContextProvider } from "@/user-client/Provider";
import { WithingsContextProvider } from '@/withings-client/Provider'
import { OuraContextProvider } from '@/oura-client/Provider'
import ConsolePage from '@/diet/components/ConsolePage'
import {
  useQueryClient,
} from '@tanstack/react-query'
import { useEffect } from 'react';

export default function RootLayout() {
    // make sure we reset the cache when logged out
  // if not the next user will se prev users data
  const queryClient = useQueryClient()
  useEffect(() => {
    return () => {
      queryClient.removeQueries()
    }
  }, []);

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

