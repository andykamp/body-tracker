import React, { useState, useEffect } from "react";
import * as t from '@/diet-server/diet.types'
import { Input } from "@geist-ui/core";
import StockSearch from '@/diet/components/StockSearch'
import itemApi from "@/diet-server/item/item.api";
import productApi from "@/diet-server/product/product.api";
import { useAuthContext } from "@/auth-client/firebase/Provider";

type ItemProps = {
  item: t.Item;
  onChange: (item: t.Item) => void;
  onDelete?: (item: t.Item) => void;
};

function Item({
  item,
  onChange,
  onDelete,
}: ItemProps) {
  const { user } = useAuthContext()

  const isCustom = item.updateOriginalItem
  console.log('isCustommmm', isCustom);

  const updateField = (key: string, value: any) => {
    // update original product
    if (isCustom) {
      console.log('updateName custom', key, value);
      const product = item.item
      const updatedProduct = { ...product, [key]: value }
      console.log('---',);
            // @todo:update cache also
      productApi.updateProduct({
        userId: user.uid,
        updatedProduct
      })
    }

    //always update the item
    onChange(({ ...item, [key]: value }));
  }

  const updateNumericField = (key: string, value: any) => {
    // update original product
    if (isCustom) {
      const product = item.item
      const updatedProduct = { ...product, [key]: value }
      console.log('ffffff',);
            // @todo:update cache also
      productApi.updateProduct({
        userId: user.uid,
        updatedProduct
      })
    }

    //always update the item
    onChange(({ ...item, [key]: +value }));
  }


  return (
    <div
      key={item.id}
      className="flex space-x-2 items-center">

      <StockSearch
        type="product"
        initialValue={item.name}
        onInputChange={(searchTerm: string) => {
          console.log('searchTerm', searchTerm);
          if (isCustom) {
            console.log('update_custom',);
            updateField('name', searchTerm)
          } else {
            const product = item.item
            // create prodict in database
            // @todo:update cache also
            productApi.addProduct({
              userId: user.uid,
              product
            })
            const newItem = {
              ...item,
              item: product,
              itemId: product.id,
              updateOriginalItem: true
            }
            onChange(newItem)
          }
        }}

        onSelect={(product: t.Product) => {
          // delete the custom product that was created
          if (isCustom) {
            const customProductToDelete = item.item.id
            // @todo:update cache also
            productApi.deleteProduct({ userId: user.uid, id: customProductToDelete })
          }

          // create a new wrapper item
          const newItem = itemApi.createItemWrapper(product, "product")
          onChange(newItem)
        }}
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
          onClick={() => onDelete?.(item)}
        >
          delete
        </button>
      }
    </div >
  );

};
export default Item;
