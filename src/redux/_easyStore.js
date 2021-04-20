// Models
import { authReducer } from "./authReducer";
import { userReducer } from "./userReducer";
import { globalReducer } from "./globalReducer";
import { adminReducer } from "./adminReducer";
import { componentReducer } from "./componentReducer";

// Main store
export const easyStore = {
    authReducer,
    userReducer,
    globalReducer,
    adminReducer,
    componentReducer,
};
