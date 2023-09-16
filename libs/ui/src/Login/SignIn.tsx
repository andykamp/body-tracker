import { Text, Spinner } from '@geist-ui/core'
import { GoogleLoginButton } from '../Button'
import Logo from '../Logo'

export type SignInProps = {
  signIn(): void
  isLoggingIn?: boolean
}

function SignIn(props: SignInProps) {
  const { signIn, isLoggingIn } = props

  return (
    <main className="flex flex-col md:flex-row-reverse md:h-screen bg-bg1">
      <section className="flex items-start w-full px-4 mx-auto md:px-0 md:items-center md:w-1/3">
        <div className="flex flex-row items-center w-full max-w-sm py-4 mx-auto md:mx-0 my-auto min-w-min relative md:-left-2.5 pt-4 md:py-4 transform origin-left bg-bg1 text-fg1">

          <div className="flex items-center space-x-1">
            <Logo />
            <Text className="font-semibold text-xl tracking-tight">Diet</Text>
          </div>

        </div>
      </section>

      <section className="justify-center px-4 md:px-0 md:flex md:w-2/3 md:border-r border-border ">
        <div className="w-full max-w-sm py-4 mx-auto my-auto min-w-min md:py-9 md:w-7/12">

          {isLoggingIn ?
            <div className="flex flex-col">
              <Text>Follow instructions in popup window</Text>
              <Spinner />
            </div>

            : (
              <div className="flex flex-col">
                <Text h2>Sign in</Text>
                <Text p className="text-secondary">New to Diet?</Text>
                <GoogleLoginButton
                  signIn={signIn}
                >
                  Sign in with Google
                </GoogleLoginButton>
              </div>
            )}

        </div>
      </section>

    </main>
  )
}
export default SignIn
