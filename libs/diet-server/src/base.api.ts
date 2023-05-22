import rootBaseApi from "@/common/api/api.base";
import firebaseApi from "@/diet-server/crud.firebase";

const CRUD_TO_USE = process.env.NEXT_PUBLIC_API_TO_USE || "firebase";

// Define an interface for an API, which is an object mapping string keys to functions
interface ApiInterface {
  [key: string]: any;
};

const AVAILABLE_CRUDS_TO_USE: Record<string, ApiInterface> = {
  firebase: firebaseApi, // Firebase is currently the only one available
};

export const CRUD_API: ApiInterface = AVAILABLE_CRUDS_TO_USE[CRUD_TO_USE];

rootBaseApi.initApi(CRUD_API)

export default rootBaseApi
