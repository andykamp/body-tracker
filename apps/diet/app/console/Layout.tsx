'use client'
import { AuthContextProvider } from '@/auth-client/firebase/Provider'
import { UserContextProvider } from "@/user-client/Provider";
// import { WithingsContextProvider } from '@/withings-client/Provider'
// import { OuraContextProvider } from '@/oura-client/Provider'
import Navbar from './navbar'
import {
  useQueryClient,
} from '@tanstack/react-query'
import { ReactNode, useEffect } from 'react';
import Page from "@/ui/Page";

type RootLayoutProps = {
  children: ReactNode
}
export default function RootLayout({
  children
}:RootLayoutProps) {
  // make sure we reset the cache when logged out
  // if not the next user will se prev users data
  const queryClient = useQueryClient()
  useEffect(() => {
    return () => {
      console.log('DELETING_ALL_QUERY_CACHE', );
      queryClient.removeQueries()
    }
  }, [queryClient]);
  console.log('ROOT layout re-render', );

  return (
    <AuthContextProvider>
      <UserContextProvider>
        {/*
        <WithingsContextProvider>
          <OuraContextProvider>
        */}
            <Navbar/>
            <Page>
            {children}
            </Page>
        {/*
          </OuraContextProvider>
        </WithingsContextProvider>
        */}
      </UserContextProvider>
    </AuthContextProvider>
  )
}



