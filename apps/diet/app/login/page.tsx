'use client'
import GoogleLoginButton from '@/ui/GoogleLoginButton'
import { signInWithGoogle } from "@/auth-client/firebase/auth.api"
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter()

  const signIn = async () => {
    try {
      await signInWithGoogle();
      console.log('route to google', );
      router.push("/console")
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <GoogleLoginButton signIn={signIn} />
    </div>
  )

}

export default Page;
