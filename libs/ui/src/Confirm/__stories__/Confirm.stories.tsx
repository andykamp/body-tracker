import { StoryFn, Meta } from '@storybook/react';
import Confirm from '@/ui/Confirm/Confirm';
import { DecoratorScreenCenter } from '@/ui/Decorators';
import { Button } from '@geist-ui/core';
import { useState } from 'react';

export default {
  title: 'Components/Confirm',
  component: Confirm
} as Meta;

const Template: StoryFn = (props: any) => {

  const [shown, setShown] = useState(false);


  return (
    <DecoratorScreenCenter>
      <Button onClick={() => setShown(true)}>Show</Button>
      <Confirm
        shown={shown}
        title="Confirm"
        content="Are you sure?"
        onConfirm={() => setShown(false)}
        onClose={() => setShown(false)}
        {...props} />
    </DecoratorScreenCenter>
  )
}

export const Default = Template.bind({});


