import { StoryFn, Meta } from '@storybook/react';
import { DecoratorScreenCenter } from '@/ui/Decorators';
import ThemeToggle from '@/ui/Theme/ThemeToggle';

export default {
  title: 'Components/Theme/ThemeToggle',
  component: ThemeToggle
} as Meta;

const Template: StoryFn = () => (
  <DecoratorScreenCenter>
    <ThemeToggle />
  </DecoratorScreenCenter>
)

export const Default = Template.bind({});


