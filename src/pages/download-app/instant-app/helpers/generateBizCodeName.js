import { getUniqueCodeName } from "utils/string/generateAlphaNumeric";
import addDashesToString from "utils/string/addDashesToString";
import getAPI from "api";

// somehow the link was failing in a critical request. So this is hardcoded right to prod url.
const checkFieldGotValue =
    "https://fiddelize.herokuapp.com/api/user/field/check-field-got-value";

export default async function generateBizCodeName(bizName) {
    if (!bizName) return null;

    const dashedBizName = addDashesToString(`${bizName}`);

    const hasNameAlready = await getAPI({
        method: "post",
        url: checkFieldGotValue,
        body: {
            role: "cliente-admin",
            field: "clientAdminData.bizLinkName",
            value: dashedBizName,
        },
        needAuth: false,
        timeoutMsgOn: false,
    });

    if (!hasNameAlready) return dashedBizName;

    const bizCode = getUniqueCodeName(bizName);
    const bizNameWithCode = `${dashedBizName}-${bizCode}`;

    // making sure if new code is already taken
    const checkedNameWithCode = await getAPI({
        method: "post",
        url: checkFieldGotValue,
        body: {
            role: "cliente-admin",
            field: "clientAdminData.bizLinkName",
            value: bizNameWithCode,
        },
        needAuth: false,
        timeoutMsgOn: false,
    });

    if (!checkedNameWithCode) return bizNameWithCode;

    const newBizCode = getUniqueCodeName(bizName);
    return `${dashedBizName}-${newBizCode}`;
}
