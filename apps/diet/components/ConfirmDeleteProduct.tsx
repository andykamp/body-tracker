import { useState } from "react";
import * as t from "@/diet-server/diet.types";
import ConfirmDelete from "./ConfirmDelete";
import productApi from "@/diet-server/product/product.api";

type ConfirmDeleteProductProps = {
  product: t.Product;
  onDelete: (meal: t.Product) => void;
}
function ConfirmDeleteProduct(props: ConfirmDeleteProductProps) {
  const { product, onDelete } = props
  const [shown, setShown] = useState(false);


  const onDeleteMiddleware = () => {
    const hasReferences = productApi.hasReferences(product)
    if (hasReferences) {
      setShown(true)
      return
    } else {
      onDelete(product)
    }
  }

  const content = () => {
    const hasReferenceMeals = productApi.hasReferenceToMeal(product)
    const hasReferenceDailies = productApi.getReferencesDaily(product)

    const standardText = 'There is no side-effects to deleting this product, and you can always restore it, but it will not show up amoung your default products.'
    if (hasReferenceMeals && hasReferenceDailies) {
      return (
        <>
          <p>
            This product is used in both daily and meal.
          </p>
          <p>
            {standardText}
          </p>
        </>
      )
    } else if (hasReferenceMeals && !hasReferenceDailies) {
      return (
        <>
          <p>
            This product is used in one or more meals
          </p>
          <p>
            {standardText}
          </p>
        </>
      )
    } else if (!hasReferenceMeals && hasReferenceDailies) {
      return (
        <>
          <p>
            This product is used in one or more dailies
          </p>
          <p>
            {standardText}
          </p>
        </>
      )
    }
  }

  return (
    <ConfirmDelete
      shown={shown}
      title="Delete product"
      content={content()}
      onClose={() => setShown(false)}
      onConfirmText="Delete"
      onConfirm={()=>onDelete(product)}
    >
      <button
        onClick={onDeleteMiddleware}
      >
        delete
      </button>
    </ConfirmDelete>
  )
}

export default ConfirmDeleteProduct;

