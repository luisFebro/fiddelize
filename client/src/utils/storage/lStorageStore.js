function combine(...objs) {
    return Object.assign({}, ...objs);
}

// COLLECTIONS - different collections receives different numbers at the very end in the order of execution
// value here are DEFAULT ones if need
const collVal1 = { collection: "onceChecked", value: true };
const collVal2 = { collection: "userProfile", value: ["cliente", undefined, 0, 0, [{desc: "compra1", value: 0}], "0"] } // Array(5).fill(undefined) same as [undefined, undefined, undefined, undefined, undefined] };
const collVal3 = { collection: "appSystem", value: "" }
const collVal4 = { collection: "clientAdmin", value: [500, "free product", ["giftA", "giftB"], "some regulation", ] }
// const collVal3 = { collection: "clientAdminProfile", value: ["cliente-admin", undefined, 500, 0, 0] } // Array(5).fill(undefined) same as [undefined, undefined, undefined, undefined, undefined] };
// END COLLECTIONS

// PROPERTIES
// sequentials
const tooltip1 = combine(collVal1, { property: "tooltipState" });
const yellowBtn2 = combine(collVal1, { property: "yellowBtnState" });

// non-sequentials
const confettiPlayOp = combine(collVal1, { property: "confettiPlay" })
const needInitialStateOp = combine(collVal1, { property: "needInitialState" });
const needAppRegisterOp = combine(collVal1, { property: "needAppRegister", value: true});

const userProfileOp = combine(collVal2, { property: ["role", "name", "currScore", "lastScore", "purchaseHistory", "bizId"], })
const clientAdminOp = combine(collVal4, { property: ["maxScore", "mainReward", "rewardList", "regulationTxt"], })

const systemOp = {
    downloadClientAdmin: combine(collVal3, { property: "roleWhichDownloaded", value: "cliente-admin"}),
    downloadClientUser: combine(collVal3, { property: "roleWhichDownloaded", value: "cliente"}),
    businessId: combine(collVal3, { property: "businessId"}),
}
// const clientAdminProfileOp = combine(collVal3, { property: ["role", "name", "bizName"], })
// END PROPERTIES

// OPTIONS - collection, properties, values
export {
    tooltip1,
    yellowBtn2,
    confettiPlayOp,
    userProfileOp,
    clientAdminOp,
    needInitialStateOp,
    needAppRegisterOp,
    systemOp,
}

export const needSetTrueLocalKey = (lastChecked, currChecked) => {
    return (!lastChecked || currChecked) ? false : true;
}



