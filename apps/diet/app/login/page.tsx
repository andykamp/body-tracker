'use client'
import GoogleLoginButton from '@/ui/GoogleLoginButton'
import { signInWithGoogle } from "@/auth-client/firebase/auth.api"
import { useRouter } from "next/navigation";
import { ROUTES_CONSOLE } from "@/diet/app/constants"
import Page from "@/ui/Page";

function LoginPage() {
  const router = useRouter()

  const signIn = async () => {
    try {
      await signInWithGoogle();
      console.log('route to google', );
      router.push(ROUTES_CONSOLE.console)
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Page className="flex justify-center items-center">
      <GoogleLoginButton signIn={signIn} />
    </Page>
  )

}

export default LoginPage;
