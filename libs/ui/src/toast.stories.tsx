import { StoryFn, Meta } from '@storybook/react';
import Toast from './toast';

export default {
  title: 'Components/Toast',
  component: Toast
} as Meta;

const Template: StoryFn = () => <Toast />;

export const Default = Template.bind({});

