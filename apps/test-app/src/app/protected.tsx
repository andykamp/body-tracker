import Navbar from '@/ui/Navbar'
import { usePathname } from "next/navigation";
import { NAVIGATION_ROUTES_CONSOLE } from "../constants"
import { signInWithGoogle, signOutOfGoogle, deleteAccount} from "@/auth/firebase/auth.api"
import Page from "@/ui/Page";
import { useAuthContext } from '@/auth-client/firebase/auth.context';

function ConsolePage() {
  const { user } = useAuthContext()
  const pathname = usePathname()

  const signIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
    }
  };
  const signOut = async () => {
    try {
      await signOutOfGoogle();
    } catch (error) {
      console.error(error);
    }
  };
  const deleteGoogleAccount = async () => {
    try {
      await deleteAccount(user);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar
        user={user}
        signIn={signIn}
        signOut={signOut}
        deleteAccount={deleteGoogleAccount}
        navigation={NAVIGATION_ROUTES_CONSOLE}
        pathname={pathname}
      />
      <Page>
        <h1>Only logged in users can view this page</h1>
        <h1>You are logged in as {user?.email}</h1>
      </Page>
    </>
  )
}

export default ConsolePage;
