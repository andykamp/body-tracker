import GoogleLoginButton from '@/ui/GoogleLoginButton'
import { signInWithGoogle } from "./utils/auth.utils"
import Page from "@/ui/Page";

function LoginPage() {

  const signIn = async () => {
    try {
      await signInWithGoogle();
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
