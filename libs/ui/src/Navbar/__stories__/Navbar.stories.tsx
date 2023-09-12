import { StoryFn, Meta } from '@storybook/react';
import Navbar from '@/ui/Navbar/Navbar';

export default {
  title: 'Components/Navbar',
  component: Navbar
} as Meta;

const user =
{
  id: 1234,
  name: "John Doe",
  username: "johnDoe",
  email: "johndoe@gmail.com",
}

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Playground', href: '/playground' }
];

const Template: StoryFn = (props: any) => <Navbar {...props} />;

export const Default = Template.bind({});
Default.args = {
  user,
  navigation,
  pathname: navigation[0].href,

};

export const NoTabs = Template.bind({});
NoTabs.args = { user, navigation: [] };

export const NoUser = Template.bind({});
NoUser.args = {
  navigation,
  pathname: navigation[0].href,
};

