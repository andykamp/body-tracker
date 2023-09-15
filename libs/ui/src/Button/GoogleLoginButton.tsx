import { Button } from "@geist-ui/core";
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
    <Button onClick={handleLogin}>{children}</Button>
  );
};

export default GoogleLoginButton;

