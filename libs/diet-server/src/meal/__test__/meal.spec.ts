// import type { AddMealToUserInput, UpdateMealInput, DeleteMealInput } from '@/diet-server/meal/meal.api';
// import * as t from '@/diet-server/diet.types';
// import * as f from '@/diet-server/meal/__support__/meal.fixtures';
// import mealApi from '@/diet-server/meal/meal.api';
// import { USERS_FIXTURE } from '@/diet-server/user/__support__/user.fixtures';
// import seeders from '@/diet-server/meal/__support__/meal.seeders'
// import { seedAddUser } from '@/diet-server/user/__support__/user.seeders';

describe.skip('mealApi', () => {
  // const testUserId = 'test_user';
  // const existingMealName = 'SmallMealsCottageCheese';
  // const nonExistingMealName = 'nonExisitingMealName';

  // beforeAll(async () => {
  //   //  seed a user inn there
  //   seedAddUser(testUserId);

  //   // seed a meal to the user
  //   seeders.seedAddMealToUser(
  //     testUserId,
  //     { name: existingMealName }
  //   )
  // });

  // describe('addMeal', () => {
  //   it('should add a new meal to the fixtures', () => {
  //     const meal: t.Meal = {
  //       name: 'Test Meal',
  //       products: ['Product A', 'Product B'],
  //       protein: 30,
  //       calories: 500,
  //       totalGrams: 200,
  //     };

  //     mealApi.addMeal(meal);

  //     expect(f.MEALS_FIXTURES[meal.name]).toEqual(meal);
  //   });
  // });

  // describe('addMealToUser', () => {
  //   it('should add a meal to the user and return a success message', () => {
  //     const input: AddMealToUserInput = {
  //       userId: testUserId,
  //       name: 'Test Meal',
  //       products: ['Product A', 'Product B'],
  //     };

  //     const response = mealApi.addMealToUser(input);

  //     expect(response.success).toBeTruthy();
  //     expect(response.message).toEqual('Meal added successfully');
  //     expect(USERS_FIXTURE[input.userId].meals[input.name]).toBeDefined();
  //   });

  //   // Add more test cases for error scenarios and edge cases
  // });

  // describe('updateMeal', () => {
  //   it('should update an existing meal and return a success message', () => {
  //     const key = existingMealName
  //     const newMeal: t.Meal = {
  //       name: 'Updated Test Meal',
  //       products: ['Product A', 'Product C'],
  //       protein: 40,
  //       calories: 600,
  //       totalGrams: 250,
  //     };

  //     const input: UpdateMealInput = { key, newMeal };

  //     const response = mealApi.updateMeal(input);

  //     expect(response.success).toBeTruthy();
  //     expect(response.message).toEqual(`Meal '${key}' updated successfully`);
  //     expect(f.MEALS_FIXTURES[newMeal.name]).toEqual(newMeal);
  //   });

  //   it('should return an error message if the meal is not found', () => {
  //     const key = nonExistingMealName
  //     const newMeal: t.Meal = {
  //       name: 'Updated Test Meal',
  //       products: ['Product A', 'Product C'],
  //       protein: 40,
  //       calories: 600,
  //       totalGrams: 250,
  //     };

  //     const input: UpdateMealInput = { key, newMeal };

  //     const response = mealApi.updateMeal(input);

  //     expect(response.success).toBeFalsy();
  //     expect(response.message).toEqual(`Meal '${key}' not found in meals fixture`);
  //   });
  // });
  // describe('updateMealToUser', () => {
  //   it('should update an existing meal for a user and return a success message', () => {
  //     const key = existingMealName
  //     const newMeal: t.Meal = {
  //       name: 'Updated Test Meal',
  //       products: ['Product A', 'Product C'],
  //       protein: 40,
  //       calories: 600,
  //       totalGrams: 250,
  //     };

  //     const input: UpdateMealInput = { key, newMeal };

  //     const response = mealApi.updateMealToUser(testUserId, input);

  //     expect(response.success).toBeTruthy();
  //     expect(response.message).toEqual(`Meal '${key}' updated successfully for user '${testUserId}'`);
  //     expect(USERS_FIXTURE[testUserId].meals[newMeal.name]).toEqual(newMeal);
  //   });

  //   it('should return an error message if the meal is not found for the user', () => {
  //     const key = nonExistingMealName
  //     const newMeal: t.Meal = {
  //       name: 'Updated Test Meal',
  //       products: ['Product A', 'Product C'],
  //       protein: 40,
  //       calories: 600,
  //       totalGrams: 250,
  //     };

  //     const input: UpdateMealInput = { key, newMeal };

  //     const response = mealApi.updateMealToUser(testUserId, input);

  //     expect(response.success).toBeFalsy();
  //     expect(response.message).toEqual(`Meal '${key}' not found for user '${testUserId}'`);
  //   });
  // });

  // describe('deleteMeal', () => {
  //   it('should delete an existing meal and return a success message', () => {
  //     const key = existingMealName

  //     const input: DeleteMealInput = { key };

  //     const response = mealApi.deleteMeal(input);

  //     expect(response.success).toBeTruthy();
  //     expect(response.message).toEqual(`Meal '${key}' deleted successfully`);
  //     expect(f.MEALS_FIXTURES[key]).toBeUndefined();
  //   });

  //   it('should return an error message if the meal is not found', () => {
  //     const key = nonExistingMealName

  //     const input: DeleteMealInput = { key };

  //     const response = mealApi.deleteMeal(input);

  //     expect(response.success).toBeFalsy();
  //     expect(response.message).toEqual(`Meal '${key}' not found in meals fixture`);
  //   });
  // });

  // describe('deleteMealToUser', () => {
  //   it('should delete an existing meal for a user and return a success message', () => {
  //     const key = existingMealName

  //     const input: DeleteMealInput = { key };

  //     const response = mealApi.deleteMealToUser(testUserId, input);

  //     expect(response.success).toBeTruthy();
  //     expect(response.message).toEqual(`Meal '${key}' deleted successfully for user '${testUserId}'`);
  //     expect(USERS_FIXTURE[testUserId].meals[key]).toBeUndefined();
  //   });

  //   it('should return an error message if the meal is not found for the user', () => {
  //     const key = nonExistingMealName

  //     const input: DeleteMealInput = { key };

  //     const response = mealApi.deleteMealToUser(testUserId, input);

  //     expect(response.success).toBeFalsy();
  //     expect(response.message).toEqual(`Meal '${key}' not found for user '${testUserId}'`);
  //   });
  // });

})
