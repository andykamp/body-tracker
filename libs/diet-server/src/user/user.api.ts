import * as t from "@/diet-server/diet.types"
import baseApi from "@/common/api/api.base";

type AddUserInput = {
  uid: string
}
/**
 * Adds a new user.
 *
 * @param {string} uid - The ID of the user to add.
 * @returns {ResponseResult} An object containing success status and a message.
 */

export async function addUser({ uid }: AddUserInput): Promise<t.ResponseResult> {
  try {
    const r = await baseApi.makeReqAndExec<t.User>({
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


type UpdateUserInput = {
  uid: string,
  user: Partial<t.User>
}
/**
 * Updates an existing user.
 *
 * @param {string} id - The ID of the user to update.
 * @param {Partial<t.User>} input - The updated user details.
 * @returns {ResponseResult} An object containing success status and a message.
 */
export async function updateUser({ uid, user }: UpdateUserInput): Promise<t.ResponseResult> {
  try {
    const r = await baseApi.makeReqAndExec<t.User>({
      proc: "updateUser",
      vars: {
        uid,
        user
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
    const r = await baseApi.makeReqAndExec<t.User>({
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
