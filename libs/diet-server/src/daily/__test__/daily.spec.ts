// import * as t from "@/diet-server/diet.types";
// import * as f from "@/diet-server/user/__support__/user.fixtures";
// import seeders from "@/diet-server/user/__support__/user.seeders";
// import userApi from "@/diet-server/user/user.api";

// const { addUser, updateUser, deleteUser } = userApi;
// const USERS_FIXTURE = f.USERS_FIXTURE;

describe("userApi", () => {

  // const testUserId = "testUser";

  // beforeAll(async () => {

  // });

  // describe('addUser', () => {
  // it('should add a new user and return a success message', () => {
  //   const response = addUser(testUserId);

  //   expect(response.success).toBeTruthy();
  //   expect(response.message).toEqual('User added successfully');
  //   expect(USERS_FIXTURE[testUserId]).toBeDefined();
  // });

  // it('should return an error message if the user already exists', () => {
  //   seeders.seedAddUser(testUserId);

  //   const response = addUser(testUserId);

  //   expect(response.success).toBeFalsy();
  //   expect(response.message).toEqual('User already exists');
  // });
  // });

  // describe('updateUser', () => {
  // it('should update an existing user and return a success message', () => {
  //   seeders.seedAddUser(testUserId);
  //   const input: Partial<t.User> = {
  //     products: { 'Product Z': { name: 'Product Z', calories: 200, protein: 15, grams: 100 } },
  //   };

  //   const response = updateUser(testUserId, input);

  //   expect(response.success).toBeTruthy();
  //   expect(response.message).toEqual('User updated successfully');
  //   expect(USERS_FIXTURE[testUserId].products).toEqual(input.products);
  // });

  // it('should return an error message if the user is not found', () => {
  //   const input: Partial<t.User> = {
  //     products: { 'Product Z': { name: 'Product Z', calories: 200, protein: 15, grams: 100 } },
  //   };

  //   const response = updateUser(testUserId, input);

  //   expect(response.success).toBeFalsy();
  //   expect(response.message).toEqual('User not found');
  // });
  // });

  // describe('deleteUser', () => {
  // it('should delete an existing user and return a success message', () => {
  //   seeders.seedAddUser(testUserId);

  //   const response = deleteUser(testUserId);

  //   expect(response.success).toBeTruthy();
  //   expect(response.message).toEqual('User deleted successfully');
  //   expect(USERS_FIXTURE[testUserId]).toBeUndefined();
  // });

  // it('should return an error message if the user is not found', () => {
  //   const testUserId = 'nonexistent_user';

  //   const response = deleteUser(testUserId);

  //   expect(response.success).toBeFalsy();
  //   expect(response.message).toEqual('User not found');
  // });
  // });

})
