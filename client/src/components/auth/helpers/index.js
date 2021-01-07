import lStorage, { needAppRegisterOp } from "../../../utils/storage/lStorage";
import { removeMultiVar, store } from "../../../hooks/storage/useVar";

export const setStorageRegisterDone = () => {
    removeMultiVar(
        [
            "memberId",
            "memberRole",
            "memberJob",
            "userScore",
            "linkCode",
            "primaryAgent",
        ],
        store.user
    ).then((res) => {
        lStorage("setItem", { ...needAppRegisterOp, value: false });
    });
};
