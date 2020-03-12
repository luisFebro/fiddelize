function combine(...objs) {
    return Object.assign({}, ...objs);
}

// COLLECTIONS - different collections receives different numbers at the very end in the order of execution
const collVal1 = { collection: "onceChecked", value: true };
const collVal2 = { collection: "userProfile", value: ["cliente", undefined, 500, 0, 0] } // Array(5).fill(undefined) same as [undefined, undefined, undefined, undefined, undefined] };
// const collVal3 = { collection: "clientAdminProfile", value: ["cliente-admin", undefined, 500, 0, 0] } // Array(5).fill(undefined) same as [undefined, undefined, undefined, undefined, undefined] };
// END COLLECTIONS

// PROPERTIES
// sequentials
const tooltip1 = combine(collVal1, { property: "tooltipState" });
const yellowBtn2 = combine(collVal1, { property: "yellowBtnState" });

// non-sequentials
const confettiPlayOp = combine(collVal1, { property: "confettiPlay" })
const needInitialStateOp = combine(collVal1, { property: "needInitialState" });
const userProfileOp = combine(collVal2, { property: ["role", "name", "maxScore", "currentScore", "lastScore"], })
const needAppRegisterOp = combine(collVal1, { property: "needAppRegister", value: true});
// const clientAdminProfileOp = combine(collVal3, { property: ["role", "name", "bizName"], })
// END PROPERTIES

// OPTIONS - collection, properties, values
export {
    tooltip1,
    yellowBtn2,
    confettiPlayOp,
    userProfileOp,
    needInitialStateOp,
    needAppRegisterOp,
}

export const needSetTrueLocalKey = (lastChecked, currChecked) => {
    return (!lastChecked || currChecked) ? false : true;
}



