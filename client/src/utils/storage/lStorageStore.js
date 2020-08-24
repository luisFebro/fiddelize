function combine(...objs) {
    return Object.assign({}, ...objs);
}

// COLLECTIONS
const collVal1 = { collection: "onceChecked", value: true };
const coll3 = { collection: "appSystem" }
// new way without separated keys and values in an array:
// LESSON: this name is what will be also used as variable throughtout the app declared in "useRoleData"
// central admin
const defaultCentralAdmin = {
    limitFreePlanNewUsers: 0,
    mainSalesWhatsapp: '(97) 99999-9999',
    mainTechWhatsapp: '(97) 99999-9999',
}
const centralAdminColl = { collection: "centralAdmin", newObj: defaultCentralAdmin };
// end central admin

// client Admin
const defaultClientAdmin = {
    bizName: "...",
    bizCodeName: "empresa-teste-et2d@yd",
    bizPlan: "gratis",
    bizWhatsapp: "(99) 99999-9999",
    maxScore: 500,
    mainReward: "Free Product",
    rewardList: [{ id: '123', icon: 'star', rewardScore: 500, rewardDesc: 'desc. prêmio', }],
    regulation: { text: "...", updatedAt: '...' },
    rewardDeadline: 0,
    totalClientUserActiveScores: 0, //not used,fetched from db in recordeduserslist, but can be useful to display in home all results so far for instance,,,
    totalClientUserScores: 0, //not used,fetched from db in recordeduserslist
    totalClientUsers: 0,
    selfBizLogoImg: "",
    selfMilestoneIcon: "star",
    selfThemePColor: "default",
    selfThemeSColor: "default",
    selfThemeBackColor: "default",
    arePrizesVisible: null,
}
const clientAdminColl = { collection: "clientAdmin", newObj: defaultClientAdmin };
// end client Admin

// user profile
const defaultUserProfile = {
    _id: "123abc",
    role: "",
    name: "...",
    phone: "",
    birthday: "29 de Fevereiro de 2020",
    updatedAt: "...",
    createdAt: "...",
    currScore: 0,
    lastScore: 0,
    bizId: "0",
    totalActiveScore: 0,
    totalGeneralScore: 0,
    totalPurchasePrize: 0,
}
const userProfileColl = { collection: "userProfile", newObj: defaultUserProfile };
// end user profile
// END COLLECTIONS

// PROPERTIES
// sequentials
const tooltip1 = combine(collVal1, { property: "tooltipState" });
const yellowBtn2 = combine(collVal1, { property: "yellowBtnState" });

// non-sequentials
const confettiPlayOp = combine(collVal1, { property: "confettiPlay" })
const setInitialStateOp = combine(collVal1, { property: "setInitialState", value: false});
const needAppRegisterOp = combine(collVal1, { property: "needAppRegister" });

const appSystemColl = coll3;

const setSystemOp = (role, id) => {
    if(!role || !id) throw new Error("arguments missing...")
    // roleWhichDownloaded: cliente || cliente-admin || dev || rep
    const obj = { roleWhichDownloaded: role, businessId: id }; //|| 'cliente'
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
    appSystemColl,
    userProfileColl,
    clientAdminColl,
    setInitialStateOp,
    needAppRegisterOp,
    setSystemOp,
    centralAdminColl,
}

export const needSetTrueLocalKey = (lastChecked, currChecked) => {
    return (!lastChecked || currChecked) ? false : true;
}



