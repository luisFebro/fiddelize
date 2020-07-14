import uuidv1 from 'uuid/v1';
const getUniqueId = () => uuidv1();

// trigger if there is the name of the component which is sending request from redux
// the component should be followed by an unique id so that it can be trigger.
function getTrigger(runNameWithId, targetName) {
    if(!runNameWithId || !targetName) return false;

    return runNameWithId.includes(targetName)
    ? runNameWithId : false;
}


// // const name = "TaskCardfsfdsafsdafds12332132132132321";
// const res = getTriggerRes(name, "TaskCard");
// console.log("res", res); // TaskCardfsfdsafsdafds12332132132132321

// this get boolean from a false status with unique ID so that useEffect can render as a new request, otherwise false will not trigger...
function treatBoolStatus(boolStr) {
    if(!boolStr) return;

    const underScoreInd = boolStr.indexOf("_");
    const bool = boolStr.slice(0, underScoreInd);
    const res = bool === "true";
    return res;
}
// const falseStatus = "false_1321321432432434323"
// const res = treatFalseStatus(falseStatus); // false boolean

export { getTrigger, getUniqueId, treatBoolStatus };
