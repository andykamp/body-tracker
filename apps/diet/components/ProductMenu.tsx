import * as t from "@/diet-server/diet.types";
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

  return (
    <div className="flex flex-col">
      <ProductList
        products={products}
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

