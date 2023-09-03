import { useEffect, useRef, useState } from "react";
import { Input } from "@geist-ui/core";
import { Github } from '@geist-ui/icons'
import ClickAndDragWrapper from "@/diet/components/DraggableLabel";

type GramInputProps = {
  originalGrams: number
  initialGrams: number
  onProsentageChange: (prosentage: number) => void;
};

function GramInput({
  originalGrams = 0,
  initialGrams = 0,
  onProsentageChange,
}: GramInputProps) {

  const [grams, setGrams] = useState(initialGrams);
  const [modificationMode, setModificationMode] = useState<'grams' | 'percentage' | 'items'>('grams');
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    onProsentageChange(grams / originalGrams)
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
        width="80px"
        value={currentValue.toFixed(0).toString()}
        placeholder="grams"
        iconClickable
        onChange={(e) => {
          handleValueChange(Number(e.target.value))
        }}

        iconRight={
          <ClickAndDragWrapper
            value={currentValue}
            min={0}
            max={max}
            increment={increment}
            onClick={() => {
              handleClick()
            }}
            onDrag={(v) => {
              handleValueChange(v)
            }}

          >
            <Github />
          </ClickAndDragWrapper >

        }
      />
      {/*
      <span>g: </span>
      <input
        type="number"
        value={currentValue}
        onChange={(e) => handleValueChange(Number(e.target.value))}
      />

      <button onClick={handleClick}>
        <Github />
      </button>
      */}
    </div>
  );
};

export default GramInput;
