function combine(...objs) {
    return Object.assign({}, ...objs);
}

const highestScoresArray =
[
    { name: "nome1",  "clientUserData": {"currScore": 0} },
    { name: "nome2", "clientUserData": {"currScore": 0}  },
    { name: "nome3", "clientUserData": {"currScore": 0} }
]

// COLLECTIONS - different collections receives different numbers at the very end in the order of execution
// value here are DEFAULT ones if need
const collVal1 = { collection: "onceChecked", value: true };
const collVal2 = { collection: "userProfile", value: ["123abc", "", "...", 0, 0, { history: [{desc: "compra1", value: 0}], updatedAt: 0 }, "0"]} // Array(5).fill(undefined) same as [undefined, undefined, undefined, undefined, undefined] };
const coll3 = { collection: "appSystem" }
const collVal4 = { collection: "clientAdmin", value: ["...", "empresa-teste-et2d@yd", "cortesia", 500, "free product", ["giftA", "giftB"], { text: "...", updatedAt: new Date() }, highestScoresArray] }
// END COLLECTIONS

// PROPERTIES
// sequentials
const tooltip1 = combine(collVal1, { property: "tooltipState" });
const yellowBtn2 = combine(collVal1, { property: "yellowBtnState" });

// non-sequentials
const confettiPlayOp = combine(collVal1, { property: "confettiPlay" })
const setInitialStateOp = combine(collVal1, { property: "setInitialState", value: false});
const needAppRegisterOp = combine(collVal1, { property: "needAppRegister" });

const userProfileOp = combine(collVal2, { property: ["_id", "role", "name", "currScore", "lastScore", "purchase", "bizId"], })
const clientAdminOp = combine(collVal4, { property: ["bizName", "bizCodeName", "bizPlan", "maxScore", "mainReward", "rewardList", "regulation", "highestScores"], })
const userProfileColl = { collection: "userProfile" };
const clientAdminColl = { collection: "clientAdmin" };
const appSystemColl = coll3;

const setSystemOp = (role, id) => {
    if(!role || !id) throw new Error("arguments missing...")
    // roleWhichDownloaded: cliente || cliente-admin || dev || rep
    const obj = { roleWhichDownloaded: role || 'cliente', businessId: id };
    const res = { ...appSystemColl, newObj: obj };

    return res;
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
    appSystemColl,
    userProfileColl,
    clientAdminColl,
    setInitialStateOp,
    needAppRegisterOp,
    setSystemOp,
}

export const needSetTrueLocalKey = (lastChecked, currChecked) => {
    return (!lastChecked || currChecked) ? false : true;
}



