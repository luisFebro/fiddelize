import { removeVars } from "init/var";

export default function setStorageRegisterDone() {
    removeVars(
        [
            "memberId",
            "memberName",
            "memberRole",
            "memberJob",
            "needAppRegister",
            "userScore",
            "linkCode",
            "primaryAgent",
        ],
        "user"
    );
}
