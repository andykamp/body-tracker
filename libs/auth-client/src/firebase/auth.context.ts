import { createContext, useContext } from 'react';
import { User } from '@/auth/firebase/auth.types'

interface AuthContextValue {
  user: User;
  loading?: boolean;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: false
});

export const useAuthContext = () => useContext(AuthContext);


