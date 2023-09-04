import { useState } from "react";
import * as t from "@/diet-server/diet.types";
import ConfirmDelete from "./ConfirmDelete";
import mealApi from "@/diet-server/meal/meal.api";

type ConfirmDeleteMealProps = {
  meal: t.Meal;
  onDelete: (meal: t.Meal) => void;
}
function ConfirmDeleteProduct(props: ConfirmDeleteMealProps) {
  const { meal, onDelete } = props
  const [shown, setShown] = useState(false);


  const onDeleteMiddleware = () => {
    const hasReferences = mealApi.hasReferences(meal)
    if (hasReferences) {
      setShown(true)
      return
    } else {
      onDelete(meal)
    }
  }

  const content = () => {
    const hasReferenceDailies = mealApi.hasReferenceToDaily(meal)

    const standardText = 'There is no side-effects to deleting this meal, and you can always restore it, but it will not show up amoung your default meals.'
    if (hasReferenceDailies) {
      return (
        <>
          <p>
            This meal is used in one or more dailies.
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
      title="Delete meal"
      content={content()}
      onClose={() => setShown(false)}
      onConfirmText="Delete"
      onConfirm={() => onDelete(meal)}
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

