import uuidv1 from 'uuid/v1';
const getUniqueId = () => uuidv1();

// trigger if there is the name of the component which is sending request from redux
// the component should be followed by an unique id so that it can be trigger.
// use it for useAPIList only since trigger does not return nothing as data, only works for updating if necessary later...
function getTrigger(runNameWithId, targetName, options = {}) {
    const { cond2 } = options;
    let trigger1 = runNameWithId;
    let trigger2 = false;

    if(cond2) {
        const gotCond2 = window.sessionStorage.getItem(cond2);
        if(!gotCond2) {
            window.sessionStorage.setItem("cond2", cond2);
        }

        if(gotCond2 !== cond2) {
            window.sessionStorage.setItem("cond2", cond2);
            trigger2 = cond2;
            if(trigger2) trigger1 = false;
        }
    }

    if(!runNameWithId || !targetName) return false;

    if(typeof runNameWithId !== "string") return;

    if(trigger1) trigger2 = false;

    const condTrigger = trigger2 || runNameWithId.toString().includes(targetName);
    return condTrigger ? (trigger2 || trigger1) : false;
}

// used for useAPI since requires the trigger to be true in the start.
function needTrigger(runNameWithId, targetName) {
    if(!runNameWithId || !targetName) return true;

    // if runNameWithId is an Array, then it returns -1
    return runNameWithId.indexOf(targetName) !== -1
    ? runNameWithId : true;
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

export { getTrigger, needTrigger, getUniqueId, treatBoolStatus };
