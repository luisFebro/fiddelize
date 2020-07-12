import uuidv1 from 'uuid/v1';
const getUniqueId = () => uuidv1();

// trigger if there is the name of the component which is sending request from redux
// the component should be followed by an unique id so that it can be trigger.
function getTrigger(runNameWithId, targetName) {
    if(!runNameWithId || !targetName) return undefined;

    return runNameWithId.includes(targetName)
    ? runNameWithId : undefined;
}

export { getTrigger, getUniqueId };

// // const name = "TaskCardfsfdsafsdafds12332132132132321";
// const res = getTriggerRes(name, "TaskCard");
// console.log("res", res); // TaskCardfsfdsafsdafds12332132132132321