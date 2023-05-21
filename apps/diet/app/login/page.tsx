'use client'
import GoogleLoginButton from '@/ui/GoogleLoginButton'
import { useRouter } from "next/navigation";
import { ROUTES_CONSOLE } from "@/diet/app/constants"
import Page from "@/ui/Page";
import { signInWithGoogle } from '@/diet/utils/auth.utils'

function LoginPage() {
  const router = useRouter()

  const signIn = async () => {
    try {
      await signInWithGoogle();
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
