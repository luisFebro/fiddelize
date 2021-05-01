// useful to handle run once an action
// uniqueKey naming should be: componentName_uniqueDescription_id.
import getVar, { setVar } from "init/var";

const insertNewValue = (uniqueKey, uniqueValue) => {
    setVar({ [uniqueKey]: uniqueValue }, "once_checked");
    return false;
};

// returns a promise - the uniqueKey is never deleted by recycled with the last updated value.
// naming convention = mainCategory_someDesc => e.g pro_nearExpiryDate
export default function didRunOnce(
    uniqueKey,
    uniqueValue = true,
    options = {}
) {
    // uniqueValue preferably should be a date
    const { trigger = true } = options;
    if (!uniqueKey) return console.log("didRunOnce requires an uniqueKey");

    return getVar(uniqueKey, "once_checked").then((valueKey) => {
        if (!trigger) return "nothing"; // need to be a truthy value to not trigger incorrectly

        if (!valueKey) {
            return insertNewValue(uniqueKey, uniqueValue);
        }
        if (JSON.stringify(valueKey) !== JSON.stringify(uniqueValue)) {
            return insertNewValue(uniqueKey, uniqueValue);
        }
        return true;
    });
}
