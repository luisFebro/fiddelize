import { removeVars } from "init/var";

export default function setStorageRegisterDone() {
    removeVars(
        [
            "memberId",
            "needAppRegister",
            "memberRole",
            "memberJob",
            "userScore",
            "linkCode",
            "primaryAgent",
        ],
        "user"
    );
}
