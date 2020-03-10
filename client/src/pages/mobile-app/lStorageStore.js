function combine(...objs) {
    return Object.assign({}, ...objs);
}

// COLLECTIONS - different collections receives different numbers at the very end in the order of execution
const collVal1 = { collection: "onceChecked", value: true };
const collVal2 = { collection: "userProfile", value: ["cliente", undefined, 500, 0, 0] } // Array(5).fill(undefined) same as [undefined, undefined, undefined, undefined, undefined] };
// END COLLECTIONS

// PROPERTIES
// sequentials
const tooltip1 = combine(collVal1, { property: "tooltipState" });
const yellowBtn2 = combine(collVal1, { property: "yellowBtnState" });

// non-sequentials
const confettiPlay = combine(collVal1, { property: "confettiPlay" })
const needInitialStateOp = combine(collVal1, { property: "needInitialState" });
const userProfileOp = combine(collVal2, { property: ["role", "name", "maxScore", "currentScore", "lastScore"], })
const needAppRegisterOp = combine(collVal1, { property: "needAppRegister", value: true});
// END PROPERTIES

// OPTIONS - collection, properties, values
export {
    confettiPlay,
    tooltip1,
    yellowBtn2,
    userProfileOp,
    needInitialStateOp,
    needAppRegisterOp,
}

export const needSetTrueLocalKey = (lastChecked, currChecked) => {
    return (!lastChecked || currChecked) ? false : true;
}



