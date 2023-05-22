import * as t from "@/diet-server/diet.types"
import baseApi from "@/diet-server/base.api";

type GetUserInput = {
  uid: string
}

async function getUser({ uid }: GetUserInput): Promise<t.User> {
  const r = await baseApi.makeReqAndExec<t.User>({
    proc: "getUser",
    vars: {
      uid
    }
  })
  return r
}

type AddUserInput = {
  uid: string
}

async function addUser({ uid }: AddUserInput): Promise<t.ResponseResult> {
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

async function updateUser({ uid, user }: UpdateUserInput): Promise<t.ResponseResult> {
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
  getUser,
  addUser,
  updateUser,
  deleteUser,
};

export type UserApi = typeof userApi;
export default userApi;
