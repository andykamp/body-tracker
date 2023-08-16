import React from "react";
import * as t from '@/diet-server/diet.types'
import { Input } from "@geist-ui/core";

type ProductItemProps = {
  product: t.Product;
  onChange: (item: t.Product) => void;
  onDelete?: (item: t.Product) => void;
  onRestore?: (item: t.Product) => void;
};

function ProductItem({
  product,
  onChange,
  onDelete,
  onRestore,
}: ProductItemProps) {

  const updateField = (key: string, value: any) => {
    onChange(({ ...product, [key]: value }));
  }

  const updateNumericField = (key: string, value: any) => {
    onChange(({ ...product, [key]: +value }));
  }

  const isDeleted = product.isDeleted

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

      {onDelete && !isDeleted &&
        <button
          onClick={() => onDelete?.(product)}
        >
          delete
        </button>
      }
      {onRestore && isDeleted &&
        <button
          onClick={() => onRestore?.(product)}
        >
          restore
        </button>
      }
    </div>
  );

};
export default ProductItem;
