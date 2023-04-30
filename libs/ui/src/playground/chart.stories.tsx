import { StoryFn, Meta } from '@storybook/react';
import Chart from './Chart';

export default {
  title: 'Components/Chart',
  component: Chart
} as Meta;

const Template: StoryFn = () => <Chart />;

export const Default = Template.bind({});

