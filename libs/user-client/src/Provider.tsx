import { ReactNode } from 'react';
import { User } from '@/diet-server/diet.types'
import {
  useQuery,
} from '@tanstack/react-query'
import userApi from '@/diet-server/user/user.api';
import { useAuthContext } from '@/auth-client/firebase/Provider'

import { createContext, useContext } from 'react';

interface UserContextValue {
  user: User;
  loading?: boolean;
}

export const UserContext = createContext<UserContextValue>({
  user: undefined as any,
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
    // refetchOnWindowFocus: false // @note: needed if not globally set
  })

  const user = query.data
  const loading = query.isLoading || query.isFetching
  const error = query.error

  if (loading) {
    return <div>userProvider loading...</div>
  }

  if (error) {
    return <div>userProvider error...</div>
  }

  console.log('USER RE-RENDER',);

  return (
    <UserContext.Provider value={{ user: user as User, loading }}>
      {children}
    </UserContext.Provider>
  );
};
