import { removeVars } from "init/var";

export default function setStorageRegisterDone() {
    removeVars(
        [
            "memberId",
            "needAppRegister",
            "memberRole",
            "memberJob",
            "memberName",
            "encryptedPTS",
            "linkCode",
            "bizLinkName",
            "primaryAgent",
        ],
        "user"
    );
}
