import React, { useState, useEffect } from "react";
import * as t from '@/diet-server/diet.types'
import GramInput from "@/diet/components/GramInput";
import { Input } from "@geist-ui/core";

type RequiredItem = Omit<t.Item, 'item'> & Required<Pick<t.Item, 'item'>>;

type DailyItemProps = {
  item: RequiredItem;
  onItemChange: (item: t.Item) => void;
  onItemDelete: (item: t.Item) => void;
};

function DailyItem({
  item,
  onItemChange,
  onItemDelete,
}: DailyItemProps) {

  const [grams, setGrams] = useState((item.item.grams ?? 0) ** item.prosentage);
  const [nutrition, setNutrition] = useState({
    protein: (item.item?.protein ?? 0) * item.prosentage,
    calories: (item.item?.calories ?? 0) * item.prosentage,
    prosentage: item.prosentage,
  });


  useEffect(() => {
    const i = item.item as any
    const multiplier = grams / i.grams

    setNutrition({
      protein: i.protein * multiplier,
      calories: i.calories * multiplier,
      prosentage: multiplier,
    });

  }, [grams]);

  useEffect(() => {
    handleSubmit()
  }, [nutrition]);

  useEffect(() => {
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
    onItemChange(updatedItem);
  };

  const onGramChange = (val: number) => {
    setGrams(val)
  }

  return (
    <div
      key={item.id}
      className="flex space-x-2 items-center">
      {item.name}

      <Input
        width="130px"
        value={nutrition.protein.toFixed(0).toString()}
        label="protein"
      />

      <Input
        width="130px"
        value={nutrition.calories.toFixed(0).toString()}
        label="calories"
      />

      <GramInput
        originalGrams={item.item.grams}
        onGramChange={onGramChange}
      />

      <button
        onClick={() => onItemDelete(item)}
      >
        delete
      </button>
    </div>
  );

};
export default DailyItem;
