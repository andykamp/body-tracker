import { StoryFn, Meta } from '@storybook/react';
import DraggableLabel from '@/ui/Input/DraggableLabel';
import { Github } from '@geist-ui/icons'
import { useState } from 'react';
import { Input } from '@geist-ui/core';

export default {
  title: 'Components/Input/DraggableLabel',
  component: DraggableLabel
} as Meta;

const Template: StoryFn = () => {
  const [value, setValue] = useState(0);

  const handleValueChange = (v: number) => {
    setValue(v)
  }

  const onClick = () => {
  }

  return (

    <Input
      value={value.toString()}
      onChange={(e) => {
        handleValueChange(Number(e.target.value))
      }}
      iconClickable
      iconRight={
        <DraggableLabel
          value={value}
          min={0}
          max={1000}
          increment={10}
          onClick={onClick}
          onDrag={(v) => {
            handleValueChange(v)
          }}
        >
          <Github />
        </DraggableLabel >
      }
    />

  )
}

export const Default = Template.bind({});
Default.args = {}


