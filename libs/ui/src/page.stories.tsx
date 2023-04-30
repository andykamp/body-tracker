import { StoryFn, Meta } from '@storybook/react';
import Page from './page';

export default {
  title: 'Components/Page',
  component: Page
} as Meta;

const Template: StoryFn = () => <Page />;

export const Default = Template.bind({});

