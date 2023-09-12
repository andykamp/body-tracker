import { StoryFn, Meta } from '@storybook/react';
import GoogleLoginButton from '@/ui/Button/GoogleLoginButton';

export default {
  title: 'Components/Button/GoogleLoginButton',
  component: GoogleLoginButton
} as Meta;

const signIn = () => {
  console.log('Sign in mock')
}
const Template: StoryFn = (props: any) => <GoogleLoginButton {...props} />;

export const Default = Template.bind({ signIn });

