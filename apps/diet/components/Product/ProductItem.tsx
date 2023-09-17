import React from "react";
import { Input } from "@geist-ui/core";
import * as t from '@/diet-server/diet.types'
import ConfirmDeleteProduct from "@/diet/components/Confirm/ConfirmDeleteProduct";

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
        label="p"
        onChange={(e) => updateNumericField('protein', e.target.value)}
      />

      <Input
        width="130px"
        value={product.calories?.toString()}
        label="c"
        onChange={(e) => updateNumericField('calories', e.target.value)}
      />


      <Input
        width="130px"
        value={product.grams?.toString()}
        label="g"
        onChange={(e) => updateNumericField('grams', e.target.value)}
      />

      {onDelete && !isDeleted &&

        <ConfirmDeleteProduct
          product={product}
          onDelete={onDelete}
        />
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
