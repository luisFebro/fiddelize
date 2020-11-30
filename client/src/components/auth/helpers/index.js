import lStorage, { needAppRegisterOp } from "../../../utils/storage/lStorage";

export const setStorageRegisterDone = () => {
    lStorage("setItem", { ...needAppRegisterOp, value: false });
};
