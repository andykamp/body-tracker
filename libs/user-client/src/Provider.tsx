import { ReactNode } from 'react';
import { User } from '@/diet-server/diet.types'
import {
  useQuery,
} from '@tanstack/react-query'
import userApi from '@/diet-server/user/user.api';
import { useAuthContext } from "@/auth-client/firebase/auth.context";

import { createContext, useContext } from 'react';

interface UserContextValue {
  user: User;
  loading?: boolean;
}

export const UserContext = createContext<UserContextValue>({
  user: undefined,
  loading: false
});

export const useUserContext = () => useContext(UserContext);

type UserContextProviderProps = {
  children: ReactNode;
}

export function UserContextProvider({
  children
}: UserContextProviderProps) {
  const { user: authUser } = useAuthContext()

  const query = useQuery({
    queryKey: ['getUser'],
    queryFn: () => userApi.getUser({ uid: authUser.uid }),
    staleTime: 10000, // only eligible to refetch after 10 seconds
  })

  const user = query.data
  const loading = query.isLoading || query.isFetching

  console.log('USERPROVIDER_QUERY', query, user,loading, );

  if (loading) {
    return <div>loading...</div>
  }

  if (!user) {
    return <div>no user</div>
  }

  return (
    <UserContext.Provider value={{ user, loading }
    }>
      {
        children
      }
    </UserContext.Provider>
  );
};
