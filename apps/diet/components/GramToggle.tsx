import { useEffect, useState } from "react";

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
    console.log('', );
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
    const newGrams = originalGrams*num
    console.log('handleItemsChange', num,grams, newGrams);
    setGrams(newGrams)
  };


  const handleGramChange = (value: number) => {
    console.log('handleGramChange', value);
    setGrams(value)
  };

  const handlePercentageChange = (percentage: number) => {
    // item.prosentage = percentage / 100;
    const newGrams = (originalGrams * percentage) / 100;
    console.log('percentage', percentage, newGrams);
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
  return (
    <div className="flex">

      <span>Grams: </span>
      <input
        type="number"
        value={modificationMode === 'percentage'
          ? prosentage * 100
          : (modificationMode === 'items'
            ? prosentage
            : grams)}
        onChange={(e) => handleValueChange(Number(e.target.value))}
      />

      <button onClick={handleClick}>
        {modificationMode}
      </button>
    </div>
  );
};

export default GramToggle;
