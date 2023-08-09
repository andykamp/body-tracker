import * as t from "@/diet-server/diet.types";
import { Checkbox } from "@geist-ui/core";
import { useState } from "react";
import ProductList from "./ProductList";

export type ProductMenuProps = {
  products: t.Product[],
  onAdd: () => void,
  onChange: (product: t.Product) => void,
  onDelete: (product: t.Product) => void,
  isFetching: boolean,
}

function ProductMenu(props: ProductMenuProps) {
  const {
    products,
    onAdd,
    onChange,
    onDelete,
    isFetching,
  } = props

  const [showCustomMealProducts, setShowCustomMealProducts] = useState(true);

  const filteredProducts = showCustomMealProducts ? products : products.filter((product) => !product.fromCustomMeal)
  const sortedProducts = filteredProducts.sort((a, b) => {
    return new Date(a.createdAt as string).getTime() - new Date(b.createdAt as string).getTime();
  });

  return (
    <div className="">

      <Checkbox
        checked={showCustomMealProducts}
        onChange={(e) => setShowCustomMealProducts(e.target.checked)}
      >
        Show products created in meals
      </Checkbox>

      <ProductList
        products={sortedProducts}
        onChange={onChange}
        onDelete={onDelete}
      />

      {isFetching ?
        <div>Loading...</div>
        :
        (<button
          onClick={() => {
            onAdd()
          }}
        >
          Add product
        </button>
        )}
    </div>
  )
}

export default ProductMenu;

