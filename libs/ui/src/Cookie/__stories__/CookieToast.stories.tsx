import { StoryFn, Meta } from '@storybook/react';
import CookieToast from '@/ui/Cookie/CookieToast';

export default {
  title: 'Components/Cookie/Toast',
  component: CookieToast
} as Meta;

const Template: StoryFn = () => <CookieToast />;

export const Default = Template.bind({});


