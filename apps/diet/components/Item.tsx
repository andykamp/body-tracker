import React from "react";
import * as t from '@/diet-server/diet.types'
import { Input } from "@geist-ui/core";
import { SearchInputControlled } from '@/diet/components/Search'

type ItemProps = {
  item: t.Item;
  onSearchChange: (search: string) => void;
  onSearchSelect: (selectedProduct: t.Product | t.Meal) => void;
  updateNumericField: (key: string, value: any) => void;
  onDelete: (item: t.Item) => void;
};

function Item({
  item,
  onSearchChange,
  onSearchSelect,
  updateNumericField,
  onDelete,

}: ItemProps) {
  console.log('ITEMMM', item.name);

  const isCustom = item.updateOriginalItem

  return (
    <div
      key={item.id}
      className="flex space-x-2 items-center">

      <SearchInputControlled
        value={item.name}
        onChange={onSearchChange}
        onSelect={onSearchSelect}
      />

      <Input
        width="130px"
        value={item.item.protein?.toString()}
        label="protein"
        onChange={(e) => updateNumericField('protein', e.target.value)}
        disabled={!isCustom}
      />

      <Input
        width="130px"
        value={item.item.calories?.toString()}
        label="calories"
        onChange={(e) => updateNumericField('calories', e.target.value)}
        disabled={!isCustom}
      />


      <Input
        width="130px"
        value={item.item.grams?.toString()}
        label="grams"
        onChange={(e) => updateNumericField('grams', e.target.value)}
        disabled={!isCustom}
      />

      {
        onDelete &&
        <button
          onClick={() => onDelete(item)}
        >
          delete
        </button>
      }
    </div >
  );

};
export default Item;
