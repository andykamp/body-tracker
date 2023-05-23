import { ReactNode } from 'react';
import { User } from '@/diet-server/diet.types'
import {
  useQuery,
} from '@tanstack/react-query'
import userApi from '@/diet-server/user/user.api';
import { useAuthContext } from "@/auth-client/firebase/auth.context";

import { createContext, useContext } from 'react';

interface UserContextValue {
  user?: User;
  loading?: boolean;
}

export const UserContext = createContext<UserContextValue>({
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
  if (!authUser) {
    throw new Error("User is undefined");
  }

  const query = useQuery({
    queryKey: ['getUser'],
    queryFn: () => userApi.getUser({ uid: authUser.uid })
  })

  const user = query.data
  const loading = query.isLoading || query.isFetching

  return (
    <UserContext.Provider value={{ user, loading }
    }>
      {
        loading
          ? <div>Loading...</div>
          : children
      }
    </UserContext.Provider>
  );
};
