import { removeMultiVar, store } from "../../../hooks/storage/useVar";

export default function setStorageRegisterDone() {
    removeMultiVar(
        [
            "memberId",
            "needAppRegister",
            "memberRole",
            "memberJob",
            "userScore",
            "linkCode",
            "primaryAgent",
        ],
        store.user
    );
}
