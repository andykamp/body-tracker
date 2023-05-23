import rootBaseApi, { type ApiInterface } from "@/common/api/api.base";
import firebaseApi from "@/diet-server/base.firebase";

const AVAILABLE_CRUDS_TO_USE: Record<string, ApiInterface> = {
  firebase: firebaseApi,
};

const CRUD_API = rootBaseApi.getApiToUse(AVAILABLE_CRUDS_TO_USE)
rootBaseApi.initApi(CRUD_API)

export default rootBaseApi
