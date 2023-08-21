import React from "react";
import * as t from '@/diet-server/diet.types'
import { Input } from "@geist-ui/core";
import Search from '@/diet/components/Search'
import itemApi from "@/diet-server/item/item.api";
import { useAuthContext } from "@/auth-client/firebase/Provider";
import {
  useQueryClient,
} from '@tanstack/react-query'
import { useMealMutations } from "./meals.mutations";

type ItemProps = {
  meal: t.Meal;
  item: t.Item;
};

function Item({
  meal,
  item,
}: ItemProps) {
  const { user } = useAuthContext()

  const queryClient = useQueryClient()

  const {
    updateProductMutation,
    deleteProductMutation,
    convertCustomProductToItemMutation,
    convertItemToCustomProductMutation,
  } = useMealMutations({ queryClient })

  const isCustom = item.updateOriginalItem

  const updateField = (key: string, value: any) => {
    // update original product
    if (isCustom) {
      console.log('updateName custom', key, value);
      const product = item.item
      const updatedProduct = { ...product, [key]: value }
      item.item = updatedProduct
    }
    const newItem = { ...item, [key]: value }

    updateProductMutation.mutate({
      userId: user.uid,
      meal,
      updatedItem: newItem
    })
  }

  const updateNumericField = (key: string, value: any) => {
    value = +value
    // update original product
    if (isCustom) {
      const product = item.item
      const updatedProduct = { ...product, [key]: value }
      item.item = updatedProduct
    }
    const newItem = { ...item, [key]: value }

    updateProductMutation.mutate({
      userId: user.uid,
      meal,
      updatedItem: newItem
    })
  }

  const onDelete = (item: t.Item) => {
    deleteProductMutation.mutate({
      userId: user.uid,
      meal,
      item
    })
  }

  return (
    <div
      key={item.id}
      className="flex space-x-2 items-center">

      <Search
        initialValue={item.name}
        onChange={(searchTerm: string) => {
          console.log('searchTerm', searchTerm);
          if (isCustom) {
            updateField('name', searchTerm)
          } else {
            console.log('SEARCH_CONVERT', );
            convertItemToCustomProductMutation.mutate({
              userId: user.uid,
              meal,
              item,
            })
            // // toggle to custom
            // // mealApi.toggleCustomProduct
            // const product = item.item
            // // create prodict in database
            // // @todo:update cache also
            // productApi.addProduct({
            //   userId: user.uid,
            //   product
            // })
            // const newItem = {
            //   ...item,
            //   item: product,
            //   itemId: product.id,
            //   updateOriginalItem: true
            // }
            // onChange(newItem)
          }
        }}

        onSelect={(selectedProduct: t.Product) => {
          // toggle to itemwrapper
          // delete the custom product that was created
          if (isCustom) {
            console.log('SELECT_CUSTOM', selectedProduct);

            convertCustomProductToItemMutation.mutate({
              userId: user.uid,
              meal,
              oldItem: item,
              newProduct: selectedProduct

            })
            // const customProductToDelete = item.item
            // // @todo:update cache also
            // productApi.deleteProduct({ userId: user.uid, product: customProductToDelete })
          } else {
            console.log('SELECT NOT CUSTOM', selectedProduct);
            // create a new wrapper item
            const newItem = itemApi.createItemWrapper(selectedProduct, "product")
            // onChange(newItem)
            updateProductMutation.mutate({
              userId: user.uid,
              meal,
              updatedItem: newItem
            })
          }
        }}
      />

      <Input
        width="130px"
        value={item.item.protein?.toString()}
        label="protein"
        onChange={(e) => updateNumericField('protein', e.target.value)}
        disabled={!isCustom}
      />

      <Input
        width="130px"
        value={item.item.calories?.toString()}
        label="calories"
        onChange={(e) => updateNumericField('calories', e.target.value)}
        disabled={!isCustom}
      />


      <Input
        width="130px"
        value={item.item.grams?.toString()}
        label="grams"
        onChange={(e) => updateNumericField('grams', e.target.value)}
        disabled={!isCustom}
      />

      {
        onDelete &&
        <button
          onClick={() => onDelete?.(item)}
        >
          delete
        </button>
      }
    </div >
  );

};
export default Item;
