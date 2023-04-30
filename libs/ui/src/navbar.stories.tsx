import { StoryFn, Meta } from '@storybook/react';
import Navbar from './Navbar';

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
const Template: StoryFn = () => <Navbar user={user} />;

export const Default = Template.bind({});

