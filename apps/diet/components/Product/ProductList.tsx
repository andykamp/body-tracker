import * as t from "@/diet-server/diet.types";
import ProductItem from "@/diet/components/Product/ProductItem";

export type ProductListProps = {
  products: t.Product[],
  onChange: (product: t.Product) => void,
  onDelete: (product: t.Product) => void,
  onRestore?: (item: t.Product) => void;
}

function ProductList(props: ProductListProps) {
  const {
    products,
    onChange,
    onDelete,
    onRestore,
  } = props

  return (
    <ul>
      {
        products.map((product: t.Product) => (
          <ProductItem
            key={product.id}
            product={product}
            onChange={onChange}
            onDelete={onDelete}
            onRestore={onRestore}
          />
        ))
      }
    </ul>
  )
}

export default ProductList;

