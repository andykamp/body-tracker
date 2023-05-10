import React, { useState, useEffect, ReactNode } from 'react';
import {
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '@/auth/firebase/config';
import { User } from '@/auth/firebase/auth.types'
import { AuthContext } from '@/auth-client/firebase/auth.context'

type AuthContextProviderProps = {
  children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
