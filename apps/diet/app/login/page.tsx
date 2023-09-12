'use client'
import GoogleLoginButton from '@/ui/Button/GoogleLoginButton'
import { useRouter } from "next/navigation";
import { ROUTES_CONSOLE } from "@/diet/app/constants"
import Page from "@/ui/Page";
import { signInWithGoogle } from '@/diet/utils/auth.utils'
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
    <Page>
      <GoogleLoginButton signIn={signIn}>
        Sign in with Google
      </GoogleLoginButton>
      {hasBeenTouched && <div>Follow instructions in popup window</div>}
    </Page>
  )

}

export default LoginPage;
