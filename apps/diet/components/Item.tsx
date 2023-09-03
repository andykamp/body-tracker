import React from "react";
import * as t from '@/diet-server/diet.types'
import { Input } from "@geist-ui/core";
import Search from '@/diet/components/SearchWrapper'
import GramInput from "./GramInput";

type ItemProps = {
  item: t.Item;
  searchType?: 'product' | 'meal' | 'both';
  onSearchChange: (search: string) => void;
  onSearchSelect: (selectedProduct: t.Product | t.Meal) => void;
  onFieldChange: (key: string, value: string) => void;
  onLock: (locked: boolean) => void;
  onDelete: (item: t.Item) => void;
};

function Item({
  item,
  searchType = 'both',
  onSearchChange,
  onSearchSelect,
  onFieldChange,
  onLock,
  onDelete,

}: ItemProps) {
  console.log('ITEMMM', item.prosentage, item);

  const isCustom = item.updateOriginalItem
  const protein = (item.item.protein || 0) * item.prosentage
  const calories = (item.item.calories || 0) * item.prosentage
  const grams = (item.item.grams || 0) * item.prosentage
  const disableLock = item.item.grams === 0

  return (
    <div
      key={item.id}
      className="flex space-x-2 items-center">

      <Search
        type={searchType}
        value={item.name}
        blacklistedItemsId={[item.id, item.itemId]}
        onChange={onSearchChange}
        onSelect={onSearchSelect}
      />

      <Input
        width="130px"
        value={protein?.toString()}
        label="protein"
        onChange={(e) => onFieldChange('protein', e.target.value)}
        disabled={!isCustom || item.isLocked}
      />

      <Input
        width="130px"
        value={calories?.toString()}
        label="calories"
        onChange={(e) => onFieldChange('calories', e.target.value)}
        disabled={!isCustom || item.isLocked}
      />

      {item.isLocked ?
        (<>
          <GramInput
            originalGrams={item.item.grams}
            initialGrams={grams}
            onProsentageChange={(prosentage) =>
              onFieldChange('prosentage', prosentage.toString())
            }
          />
          <button onClick={() => onLock(false)}>un-lock</button>
        </>) :
        (
          <>
            <Input
              width="130px"
              value={grams?.toString()}
              label="grams"
              onChange={(e) => onFieldChange('grams', e.target.value)}
              disabled={!isCustom}
            />
            <button
              className={disableLock ? 'text-gray-400 cursor-not-allowed' : ''}
              disabled={disableLock}
              onClick={() => onLock(true)}
            >
              lock
            </button>
          </>
        )
      }

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
