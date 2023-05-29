import React, { useState, useEffect } from "react";
import * as t from '@/diet-server/diet.types'
import GramToggle from "@/diet/components/GramToggle";

type RequiredItem = Omit<t.Item, 'item'> & Required<Pick<t.Item, 'item'>>;

type ItemWrapperProps = {
  item: RequiredItem;
  onItemChange: (item: t.Item) => void;
};

function ItemWrapper({
  item,
  onItemChange
}: ItemWrapperProps) {

  const [grams, setGrams] = useState((item.item.grams ?? 0) ** item.prosentage);
  const [nutrition, setNutrition] = useState({
    protein: (item.item?.protein ?? 0) * item.prosentage,
    calories: (item.item?.calories ?? 0) * item.prosentage,
    prosentage: item.prosentage,
  });


  useEffect(() => {
    const i = item.item as any
    const multiplier = grams / i.grams
    console.log('mulitplyer', multiplier);

    setNutrition({
      protein: i.protein * multiplier,
      calories: i.calories * multiplier,
      prosentage: multiplier,
    });

  }, [grams]);

  useEffect(() => {
    console.log('nutrition', nutrition);
    handleSubmit()
  }, [nutrition]);

  useEffect(() => {
    console.log('itemmmm', item);
    setNutrition({
      protein: (item.item?.protein ?? 0) * item.prosentage,
      calories: (item.item?.calories ?? 0) * item.prosentage,
      prosentage: item.prosentage,
    });
    setGrams((item.item.grams ?? 0) * item.prosentage)
  }, [item]);


  const handleSubmit = () => {
    const updatedItem = {
      ...item,
      ...nutrition,
    } as any;
    console.log('updatedItem', nutrition, updatedItem);
    onItemChange(updatedItem);
  };

  const onGramChange = (val: number) => {
    setGrams(val)
  }

  return (
    <div className="flex space-x-2 items-center">
      {item.name}

      <span>Protein: {nutrition.protein}</span>

      <span>Calories: {nutrition.calories}</span>

      <GramToggle
        originalGrams={item.item.grams}
        onGramChange={onGramChange}
      />

      <button onClick={handleSubmit}>Update Item</button>
    </div>
  );

};
export default ItemWrapper;
