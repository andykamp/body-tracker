import * as t from "@/diet-server/diet.types"
import * as f from "@/diet-server/user/__support__/user.fixtures";
import baseApi from "@/common/api/api.base";

const USERS: t.Users = f.USERS_FIXTURE;

type AddUserInput = {
  uid: string
}
/**
 * Adds a new user.
 *
 * @param {string} uid - The ID of the user to add.
 * @returns {ResponseResult} An object containing success status and a message.
 */

export async function addUser(uid: string): Promise<t.ResponseResult> {
  try {
    const r = await baseApi.makeReqAndExec<t.Product>({
      proc: "addUser",
      vars: {
        uid
      }
    })
    return {
      success: true,
      message: "User added successfully",
    };
  } catch (e) {
    return {
      success: false,
      message: e
    };
  }
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

type DeleteUserInput = {
  uid: string
}
/**
 * Deletes an existing user.
 *
 * @param {string} id - The ID of the user to delete.
 * @returns {ResponseResult} An object containing success status and a message.
 */
export async function deleteUser({ uid }: DeleteUserInput): Promise<t.ResponseResult> {
  try {
    const r = await baseApi.makeReqAndExec<t.Product>({
      proc: "deleteUser",
      vars: {
        uid
      }
    })
    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (e) {
    return {
      success: false,
      message: e
    };
  }
}

const userApi = {
  addUser,
  updateUser,
  deleteUser,
};

export type UserApi = typeof userApi;
export default userApi;
