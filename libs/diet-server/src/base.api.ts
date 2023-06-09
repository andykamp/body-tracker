import rootBaseApi, { type ApiInterface } from "@/common/api/api.base";
import firebaseCrudApi from "@/diet-server/crud/crud.firebase";

const AVAILABLE_CRUDS_TO_USE: Record<string, ApiInterface> = {
  firebase: firebaseCrudApi,
};

const CRUD_API = rootBaseApi.getApiToUse(AVAILABLE_CRUDS_TO_USE)
rootBaseApi.initApi(CRUD_API)

export default rootBaseApi
