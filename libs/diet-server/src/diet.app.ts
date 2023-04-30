import productApi from "@/diet-server/product/product.api";
const result = productApi.addProduct({ name: "NewProductName", protein: 10, calories: 50, grams: 20 });

if (result.success) {
  console.log(result.message); // Or display a success message to the user
} else {
  console.warn(result.message); // Or display a warning message to the user
}
