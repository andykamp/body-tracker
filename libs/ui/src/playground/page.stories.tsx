import { StoryFn, Meta } from '@storybook/react';
import Page from './Page';

export default {
  title: 'Components/ChartPage',
  component: Page
} as Meta;

const Template: StoryFn = () => <Page />;

export const Default = Template.bind({});

