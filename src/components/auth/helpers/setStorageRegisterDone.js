import { removeVars } from "init/var";

export default function setStorageRegisterDone() {
    removeVars(
        [
            "memberId",
            "needAppRegister",
            "memberRole",
            "memberJob",
            "memberName",
            "userScore",
            "linkCode",
            "primaryAgent",
        ],
        "user"
    );
}
