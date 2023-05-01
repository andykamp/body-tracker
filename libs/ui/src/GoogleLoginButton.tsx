import { signInWithGoogle } from '@/auth-client/firebase/auth.api';
import { User } from 'firebase/auth';

type GoogleLoginButtonProps = {
  signIn(): void
}
const GoogleLoginButton = ({ signIn }: GoogleLoginButtonProps) => {

  const handleLogin = async () => {
    try {
      signIn();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={handleLogin}>Login</button>
  );
};

export default GoogleLoginButton;

