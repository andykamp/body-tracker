import React from "react";
import { Input } from "@geist-ui/core";

export type Product = {
  id: string,
  name: string;
  description?: string;

  protein: number;
  calories: number
  grams: number;
}

type ProductItemProps = {
  product: Product;
};

export function ProductItem({
  product:_product,
}: ProductItemProps) {
  const [product, setProduct] = React.useState(_product); 

  const updateNumericField = (key: string, value: any) => {
    const newValue = parseInt(value);
    if (isNaN(newValue)) {
      return;
    }

    setProduct({
      ...product,
      [key]: newValue,
    });
  }

  return (
    <div
      key={product.id}
      className="flex space-x-2 items-center">

      <Input
        className="min-w-[60px]"
        value={product.name}
        placeholder="New item..."
      />

      <Input
        width="80px"
        value={product.protein?.toString()}
        label="p"
        onChange={(e) => updateNumericField('protein', e.target.value)}
      />

      <Input
        width="85px"
        value={product.calories?.toString()}
        label="c"
        onChange={(e) => updateNumericField('calories', e.target.value)}
      />


      <Input
        width="85px"
        value={product.grams?.toString()}
        label="g"
        onChange={(e) => updateNumericField('grams', e.target.value)}
      />
    </div>
  );

};

