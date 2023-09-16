import { StoryFn, Meta } from '@storybook/react';
import SignIn from '@/ui/Login/SignIn';

export default {
  title: 'Components/SignIn',
  component: SignIn
} as Meta;

const signIn = () => {
  console.log('Sign in mock')
}

const Template: StoryFn = (props: any) => (
  <SignIn {...props} />
)

export const Default = Template.bind({});
Default.args = {
 signIn
}


