import { getUniqueCodeName } from "utils/string/generateAlphaNumeric";
import addDashesToString from "utils/string/addDashesToString";
import getAPI, { checkFieldGotValue } from "api";

export default async function generateBizCodeName(bizName) {
    if (!bizName) return;

    const dashedBizName = addDashesToString(`${bizName}`);

    const body = {
        role: "cliente-admin",
        field: "clientAdminData.bizLinkName",
        value: dashedBizName,
    };

    const hasNameAlready = await getAPI({
        method: "post",
        url: checkFieldGotValue(),
        body,
    });
    if (!hasNameAlready) return dashedBizName;

    const bizCode = getUniqueCodeName(bizName);
    const bizNameWithCode = `${dashedBizName}-${bizCode}`;

    // making sure if new code is already taken
    const bodyWithCode = {
        role: "cliente-admin",
        field: "clientAdminData.bizLinkName",
        value: bizNameWithCode,
    };

    const checkedNameWithCode = await getAPI({
        method: "post",
        url: checkFieldGotValue(),
        body: bodyWithCode,
    });

    if (!checkedNameWithCode) return bizNameWithCode;

    const newBizCode = getUniqueCodeName(bizName);
    return `${dashedBizName}-${newBizCode}`;
}
