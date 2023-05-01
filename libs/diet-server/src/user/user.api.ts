import * as t from "@/diet-server/diet.types"
import * as f from "@/diet-server/user/__support__/user.fixtures";
import { createUser } from "./user.utils";

const USERS: t.Users = f.USERS_FIXTURE;

/**
 * Adds a new user.
 *
 * @param {string} id - The ID of the user to add.
 * @returns {ResponseResult} An object containing success status and a message.
 */
export function addUser(id: string): t.ResponseResult {
  if (USERS[id]) {
    return {
      success: false,
      message: "User already exists",
    };
  }

  USERS[id] = createUser(id) 
  return {
    success: true,
    message: "User added successfully",
  };
}

/**
 * Updates an existing user.
 *
 * @param {string} id - The ID of the user to update.
 * @param {Partial<t.User>} input - The updated user details.
 * @returns {ResponseResult} An object containing success status and a message.
 */
export function updateUser(id: string, input: Partial<t.User>): t.ResponseResult {
  if (!USERS[id]) {
    return {
      success: false,
      message: "User not found",
    };
  }

  USERS[id] = { ...USERS[id], ...input };
  return {
    success: true,
    message: "User updated successfully",
  };
}

/**
 * Deletes an existing user.
 *
 * @param {string} id - The ID of the user to delete.
 * @returns {ResponseResult} An object containing success status and a message.
 */
export function deleteUser(id: string): t.ResponseResult {
  if (!USERS[id]) {
    return {
      success: false,
      message: "User not found",
    };
  }

  delete USERS[id];
  return {
    success: true,
    message: "User deleted successfully",
  };
}

const userApi = {
  addUser,
  updateUser,
  deleteUser,
};

export type UserApi = typeof userApi;
export default userApi;
