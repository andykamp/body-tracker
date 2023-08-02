import React, { useState, useEffect } from "react";
import * as t from '@/diet-server/diet.types'
import { Input } from "@geist-ui/core";
import productApi from "@/diet-server/product/product.api"


type ProductItemProps = {
  product: t.Product;
  onChange: (item: t.Product) => void;
  onDelete?: (item: t.Product) => void;
};

function ProductItem({
  product,
  onChange,
  onDelete,
}: ProductItemProps) {

  const updateField = (key: string, value: any) => {
    onChange(({ ...product, [key]: value }));
  }

  const updateNumericField = (key: string, value: any) => {
    onChange(({ ...product, [key]: +value }));
  }

  return (
    <div
      key={product.id}
      className="flex space-x-2 items-center">

      <Input
        width="130px"
        value={product.name}
        placeholder="New item..."
        onChange={(e) => updateField('name', e.target.value)}
      />

      <Input
        width="130px"
        value={product.protein?.toString()}
        label="protein"
        onChange={(e) => updateNumericField('protein', e.target.value)}
      />

      <Input
        width="130px"
        value={product.calories?.toString()}
        label="calories"
        onChange={(e) => updateNumericField('calories', e.target.value)}
      />


      <Input
        width="130px"
        value={product.grams?.toString()}
        label="grams"
        onChange={(e) => updateNumericField('grams', e.target.value)}
      />

      {onDelete &&
        <button
          onClick={() => onDelete?.(product)}
        >
          delete (check meal dependencies)
        </button>
      }
    </div>
  );

};
export default ProductItem;
