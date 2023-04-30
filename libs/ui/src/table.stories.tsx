import { StoryFn, Meta } from '@storybook/react';
import Table from './table';
import { Card, Title, Text } from '@tremor/react';

export default {
  title: 'Components/Table',
  component: Table
} as Meta;

const users = [
  {
    id: 123,
    name: "John Doe",
    username: "johnDoe",
    email: "johndoe@gmail.com",
  },
    {
    id: 1234,
    name: "John Doe",
    username: "johnDoe",
    email: "johndoe@gmail.com",
  }

]
const Template: StoryFn = () => (
  <Card className="mt-6">
    <Table users={users} />
  </Card>
);

export const Default = Template.bind({});

