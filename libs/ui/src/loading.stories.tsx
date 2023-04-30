import { StoryFn, Meta } from '@storybook/react';
import Loading from './loading';

export default {
  title: 'Components/Loading',
  component: Loading
} as Meta;

const Template: StoryFn = () => <Loading />;

export const Default = Template.bind({});

