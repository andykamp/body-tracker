import { StoryFn, Meta } from '@storybook/react';
import Page from '@/ui/Page/Page';

export default {
  title: 'Components/Page',
  component: Page
} as Meta;

const Template: StoryFn = () => (
  <Page>
    <div className="flex justify-center items-center">
      some content
    </div>
  </Page>
);

export const Default = Template.bind({});

