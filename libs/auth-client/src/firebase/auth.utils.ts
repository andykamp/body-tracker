import { useEffect, useState } from 'react';
import { auth } from '@/auth/firebase/config';
import type { AuthObject, User } from '@/auth-client/firebase/auth.types';

export function useAuth(): AuthObject | null {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      if (user) {
        setUser({
          email: user.email,
        });
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  const authObject = user && { user };
  return authObject;
}


