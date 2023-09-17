import { useState } from "react";
import { Checkbox } from "@geist-ui/core";
import * as t from "@/diet-server/diet.types";
import ProductList from "@/diet/components/Product/ProductList";

export type ProductMenuProps = {
  products: t.Product[],
  onCreate: () => void,
  onChange: (product: t.Product) => void,
  onDelete: (product: t.Product) => void,
  onRestore: (product: t.Product) => void,
  isFetching: boolean,
}

function ProductMenu(props: ProductMenuProps) {
  const {
    products,
    onCreate,
    onChange,
    onDelete,
    onRestore,
    isFetching,
  } = props

  const [showCustomMealProducts, setShowCustomMealProducts] = useState(true);
  const [showCustomDailyProducts, setShowCustomDailyProducts] = useState(true);
  const [showDeletedProducts, setShowDeletedProducts] = useState(false);

  let filteredProducts = showCustomMealProducts ? products : products.filter((product) => !product.fromCustomMeal)
  filteredProducts = showCustomDailyProducts ? products : products.filter((product) => !product.fromCustomDaily)
  filteredProducts = showDeletedProducts ? filteredProducts : filteredProducts.filter((product) => !product.isDeleted)
  const sortedProducts = filteredProducts.sort((a, b) => {
    return new Date(a.createdAt as string).getTime() - new Date(b.createdAt as string).getTime();
  });

  return (
    <div className="">

      <div className="flex flex-col">
        <Checkbox
          checked={showCustomMealProducts}
          onChange={(e) => setShowCustomMealProducts(e.target.checked)}
        >
          Show products created in meals
        </Checkbox>
        <Checkbox
          checked={showCustomMealProducts}
          onChange={(e) => setShowCustomDailyProducts(e.target.checked)}
        >
          Show products created in daily
        </Checkbox>

        <Checkbox
          checked={showDeletedProducts}
          onChange={(e) => setShowDeletedProducts(e.target.checked)}
        >
          Show deleted products
        </Checkbox>
      </div>

      <ProductList
        products={sortedProducts}
        onChange={onChange}
        onDelete={onDelete}
        onRestore={onRestore}
      />

      {isFetching ?
        <div>Loading...</div>
        :
        (<button
          onClick={() => {
            onCreate()
          }}
        >
          Add product
        </button>
        )}
    </div>
  )
}

export default ProductMenu;

