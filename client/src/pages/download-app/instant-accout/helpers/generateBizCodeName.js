import { getUniqueCodeName } from "../../../../utils/string/generateAlphaNumeric";
import addDashesToString from "../../../../utils/string/addDashesToString";

export default function generateBizCodeName(bizName) {
    if (!bizName) return;

    const bizCode = getUniqueCodeName(bizName);
    const dashedBizName = addDashesToString(`${bizName}`);

    return `${dashedBizName}-${bizCode}`;
}
