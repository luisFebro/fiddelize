// Models
import { authReducer } from "./authReducer";
import { userReducer } from "./userReducer";
import { globalReducer } from "./globalReducer";
import { adminReducer } from "./adminReducer";

// Main store
export const easyStore = {
    authReducer,
    userReducer,
    globalReducer,
    adminReducer,
};
