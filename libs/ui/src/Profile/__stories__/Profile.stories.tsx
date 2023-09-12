import { StoryFn, Meta } from '@storybook/react';
import Profile from '@/ui/Profile/Profile';

export default {
  title: 'Components/Profile',
  component: Profile
} as Meta;

const user =
{
  id: 1234,
  name: "John Doe",
  username: "johnDoe",
  email: "johndoe@gmail.com",
}

const signIn = () => {
  console.log('Sign in mock')
}

const signOut = () => {
  console.log('Sign out mock')
}
const Template: StoryFn = (props: any) => (
  <div className="w-full flex justify-end">
  <Profile {...props} />
  </div>
)

export const Default = Template.bind({});
Default.args = {
 user, signIn , signOut
}


