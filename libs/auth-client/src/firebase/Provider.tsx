import React, { useState, useEffect, ReactNode } from 'react';
import {
  onAuthStateChanged,
} from 'firebase/auth';
import authApi from '@/auth/firebase/auth.api';
const auth = authApi.getAuth()
import { User } from '@/auth/firebase/auth.types'
import { useRouter } from "next/navigation";
import { createContext, useContext } from 'react';

interface AuthContextValue {
  user: User;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextValue>({
  user: undefined,
  loading: false
});

export const useAuthContext = () => useContext(AuthContext);


type AuthContextProviderProps = {
  children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/")
        setUser(undefined);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>loading...</div>
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
