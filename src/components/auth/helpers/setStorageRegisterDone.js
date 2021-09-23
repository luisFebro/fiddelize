import { removeVars } from "init/var";

export default function setStorageRegisterDone() {
    removeVars(
        [
            "memberId",
            "needPWA",
            "needAppRegister",
            "memberRole",
            "memberJob",
            "memberName",
            "encryptedPTS",
            "linkCode",
            "primaryAgent",
        ],
        "user"
    );
}
