import * as t from "@/diet-server/diet.types";
import userApi from "@/diet-server/user/user.api";

export function seedAddUser(userId: string): t.ResponseResult {
  return userApi.addUser(userId);
}

export function seedUpdateUser(
  userId: string,
  data?: Partial<t.User>
): t.ResponseResult {
  const userData = {
    products: {},
    meals: {},
    targetCalories: 0,
    targetProteins: 0,
    ...data,
  };

  return userApi.updateUser(userId, userData);
}

export function seedDeleteUser(userId: string): t.ResponseResult {
  return userApi.deleteUser(userId);
}

const userSeeder = {
  seedAddUser,
  seedUpdateUser,
  seedDeleteUser,
};

export default userSeeder;

