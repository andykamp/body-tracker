import * as t from "@/diet-server/diet.types"
import baseApi from "@/diet-server/base.api";
import { GENDER } from "@/diet-server/diet.constants";
import { createUserObject } from "@/diet-server/user/user.utils";
import { calulateDailyCalories, calulateDailyProtein } from "@/diet-server/utils/diet.utils";
import { withings as withingsFixture } from "@/withings/__support__/fixtures"

type GetUserInput = {
  uid: string
}

async function getUser({ uid }: GetUserInput): Promise<t.User> {
  console.log('GETTT_USER',uid );
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
  const initialUserData: t.User = userApi.createUserObject({
    id: uid,
    targetCalories: calulateDailyCalories({ weight: 95, zone: 13 }),
    targetProteins: calulateDailyProtein({ weight: 95 }),
    weight: 95,
    height: 193,
    age: 27,
    gender: GENDER.MALE,
    goal: 13,
    deficitOrSurplus: 500,
    caloryExpenditure: 3000,
    withings: withingsFixture
  });


  try {
    const r = await baseApi.makeReqAndExec<t.User>({
      proc: "addUser",
      vars: {
        uid,
        initialUserData
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

async function updateUser({ uid, user }: UpdateUserInput): Promise<any> {
  console.log('updateUser', uid, user);
  return await baseApi.makeReqAndExec<t.User>({
    proc: "updateUser",
    vars: {
      uid,
      user
    }
  })
}


type DeleteUserInput = {
  uid: string
}

export async function deleteUser({ uid }: DeleteUserInput): Promise<any> {
  return await baseApi.makeReqAndExec<t.User>({
    proc: "deleteUser",
    vars: {
      uid
    }
  })
}

const userApi = {
  createUserObject,
  getUser,
  addUser,
  updateUser,
  deleteUser,
};

export type UserApi = typeof userApi;
export default userApi;
