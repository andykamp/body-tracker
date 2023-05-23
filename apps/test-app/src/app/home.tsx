import Navbar from '@/ui/Navbar'
import { useLocation } from 'react-router-dom';
import { NAVIGATION_ROUTES_HOME } from "../constants"
import { signInWithGoogle } from '../utils/auth.utils'
import Page from "@/ui/Page";
import ProtectedPage from "./protected"

function HomePage() {
  const location = useLocation();

  const signIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Page>
      <Navbar
        signIn={signIn}
        navigation={NAVIGATION_ROUTES_HOME}
        pathname={location.pathname}
      />
      <h1>This is the main page</h1>
      <ProtectedPage />
    </Page>
  )

}

export default HomePage
