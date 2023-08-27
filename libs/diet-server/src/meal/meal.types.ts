import * as t from "@/diet-server/diet.types";

export type GetMealsInput = {
  userId: string;
}

export type AddMealInput = {
  userId: string;
  meal: t.Meal;
};

export type UpdateMealInput = {
  userId: string;
  meal: t.Meal;
};

export type SoftDeleteMealInput = {
  userId: string,
  meal: t.Meal,
}

export type RestoreDeletedMealInput = {
  userId: string,
  meal: t.Meal,
}

export type DeleteMealInput = {
  userId: string;
  meal: t.Meal;
  fromDaily?: string;
}

export type AddProductToMealInput = {
  userId: string;
  meal: t.Meal;
};

export type UpdateProductFromMealInput = {
  userId: string;
  meal: t.Meal;
  updatedItem: t.Item;
};

export type RemoveProductFromMealInput = {
  userId: string;
  meal: t.Meal;
  item: t.Item;
};

export type ConvertCustomProductToItemInput = {
  userId: string;
  meal: t.Meal;
  oldItem: t.Item;
  newProduct: t.Product;
}

export type ConvertItemToCustomProductInput = {
  userId: string;
  meal: t.Meal;
  item: t.Item;
  adjustedAttributes: {
    name?: string;
  }
}



