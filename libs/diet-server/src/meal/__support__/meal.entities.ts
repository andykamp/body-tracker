export const MealEntity = {
  name: expect.any(String),
  products: expect.arrayContaining([expect.any(String), expect.objectContaining({
    name: expect.any(String),
    protein: expect.any(Number),
    calories: expect.any(Number),
    grams: expect.any(Number),
  })]),
  protein: expect.any(Number),
  calories: expect.any(Number),
  totalGrams: expect.any(Number),
};
