import { useEffect, useState } from "react";
import { Input, useInput } from "@geist-ui/core";
import { Github } from '@geist-ui/icons'
import ClickAndDragWrapper from "@/diet/components/DraggableLabel";

type GramToggleProps = {
  originalGrams?: number
  onGramChange: (val: number) => void;
};

function GramToggle({
  originalGrams = 0,
  onGramChange,
}: GramToggleProps) {

  const [grams, setGrams] = useState(originalGrams);
  const [modificationMode, setModificationMode] = useState<'grams' | 'percentage' | 'items'>('grams');

  useEffect(() => {
    onGramChange(grams)
  }, [grams])

  const handleClick = () => {
    if (modificationMode === 'grams') {
      setModificationMode('percentage');
    } else if (modificationMode === 'percentage') {
      setModificationMode('items');
    } else {
      setModificationMode('grams');
    }
  };

  const handleItemsChange = (num: number) => {
    const newGrams = Math.round(originalGrams * num)
    setGrams(newGrams)
  };


  const handleGramChange = (value: number) => {
    setGrams(value)
  };

  const handlePercentageChange = (percentage: number) => {
    // item.prosentage = percentage / 100;
    const newGrams = (originalGrams * percentage) / 100;
    setGrams(newGrams)
  };

  const handleValueChange = (value: number) => {
    if (modificationMode === 'percentage') {
      handlePercentageChange(value);
    } else if (modificationMode === 'items') {
      handleItemsChange(value)
    } else {
      handleGramChange(value);
    }
  };

  const { state, setState, reset, bindings } = useInput('Geist UI')

  const prosentage = grams / originalGrams
  const currentValue = modificationMode === 'percentage'
    ? prosentage * 100
    : (modificationMode === 'items'
      ? prosentage
      : grams)
  const max = modificationMode === 'items' ? 100 : 10000
  const increment = 1

  return (
    <div className="flex">

      <Input
        width="100px"
        value={currentValue.toFixed(0).toString()}
        placeholder="grams"
        iconClickable

        iconRight={
          <ClickAndDragWrapper
            value={currentValue}
            min={0}
            max={max}
            increment={increment}
            onClick={() => {
              console.log('onClick')
              handleClick()
            }}
            onDrag={(v) => {
              console.log('ondrag', v);
              handleValueChange(v)
            }}
          >
            <Github />
          </ClickAndDragWrapper >

        } />
      <span>g: </span>
      <input
        type="number"
        value={currentValue}
        onChange={(e) => handleValueChange(Number(e.target.value))}
      />

      <button onClick={handleClick}>
            <Github />
      </button>
    </div>
  );
};

export default GramToggle;
