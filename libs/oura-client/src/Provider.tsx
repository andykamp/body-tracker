import type * as t from '@/oura-client/types';
import { ReactNode, useEffect } from 'react';
import { createContext, useContext } from 'react';
import { useUserContext } from "@/user-client/Provider";
import { useData } from '@/oura-client/utils';
import {
  useQueryClient,
} from '@tanstack/react-query'

interface OuraContextValue {
  dataState?: t.DataState
}

export const OuraContext = createContext<OuraContextValue>({});

export const useOuraContext = () => useContext(OuraContext);

type OuraContextProviderProps = {
  children: ReactNode;
}

export function OuraContextProvider({
  children
}: OuraContextProviderProps) {
  const { user } = useUserContext()
  console.log('OURAPROVIDER_USER', user);

  useEffect(() => {
    console.log('OURAPROVIDER_USER_UPDATE', user);
  }, [user?.oura]);


  const queryClient = useQueryClient()
  // queryClient.invalidateQueries({ queryKey: ['getUser'] })

  // get Oura data
  const dataState = null
  // const dataState = useData({
  //   accessToken: user?.oura?.access_token
  // })

  return (
    <OuraContext.Provider value={{ dataState }
    }>
      {
        children
      }
    </OuraContext.Provider>
  );
}
