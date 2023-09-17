'use client'
import { useRouter } from "next/navigation";
import { ROUTES_CONSOLE } from "@/diet/app/constants"
import SignIn from "@/ui/Login/SignIn";
import { signInWithGoogle } from '@/common-client/utils/auth.utils'
import { useState } from 'react';

function LoginPage() {
  const router = useRouter()
  const [hasBeenTouched, setHasBeenTouched] = useState(false);


  const signIn = async () => {
    try {
      setHasBeenTouched(true)
      await signInWithGoogle();
      console.log('redirecting',);
      router.push(ROUTES_CONSOLE.console)
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SignIn
    signIn={signIn}
    isLoggingIn={hasBeenTouched}
    />
  )

}

export default LoginPage;
