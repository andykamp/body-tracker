import { StoryFn, Meta } from '@storybook/react';
import Navbar from '@/ui/Navbar/Navbar';
import { user } from '@/ui/__fixtures__/user.fixtures';

export default {
  title: 'Components/Navbar',
  component: Navbar
} as Meta;

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

