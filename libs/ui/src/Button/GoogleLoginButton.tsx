import { ReactNode } from "react";

export type GoogleLoginButtonProps = {
  signIn(): void
  children?: ReactNode;
}

const GoogleLoginButton = ({
  signIn,
  children = 'Sign in',
}: GoogleLoginButtonProps) => {

  const handleLogin = async () => {
    try {
      signIn();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={handleLogin}>{children}</button>
  );
};

export default GoogleLoginButton;

