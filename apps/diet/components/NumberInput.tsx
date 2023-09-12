import React, { useState } from 'react';
import { Input, InputProps } from '@geist-ui/core';


// @todo: this will not react to external state
function NumberInput (props:InputProps) {
  const [value, setValue] = useState<string | number>(props.value || '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Use a regex to check if the value is numeric and contains no decimals
    if (/^\d*$/g.test(inputValue)) {
      setValue(inputValue);

      // If there's an onChange in props, call it.
      if (props.onChange) {
        props.onChange(e);
      }
    }
  };

  return (
    <Input
      {...props}
      value={value.toString()}
      onChange={handleInputChange}
    />
  );
}

export default NumberInput;

