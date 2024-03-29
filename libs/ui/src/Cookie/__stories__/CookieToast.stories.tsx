import { StoryFn, Meta } from '@storybook/react';
import CookieToast from '@/ui/Cookie/CookieToast';
import { DecoratorScreenCenter } from '@/ui/Decorators';

export default {
  title: 'Components/Cookie/Toast',
  component: CookieToast
} as Meta;

const Template: StoryFn = () => (
  <DecoratorScreenCenter>
    <CookieToast />
  </DecoratorScreenCenter>
)

export const Default = Template.bind({});


