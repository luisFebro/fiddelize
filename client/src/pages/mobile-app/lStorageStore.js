function combine(...objs) {
    return Object.assign({}, ...objs);
}

// COLLECTIONS - different collections receives different numbers at the very end in the order of execution
const coll1 = { collection: "onceChecked" };
const val1 = { value: true };
const collVal1 = combine(coll1, val1);
// END COLLECTIONS

// PROPERTIES
const confettiPlay = combine(collVal1, { property: "confettiPlay" })
const tooltip1 = combine(collVal1, { property: "tooltipState" });
const yellowBtn2 = combine(collVal1, { property: "yellowBtnState" });
// END PROPERTIES
export {
    confettiPlay,
    tooltip1,
    yellowBtn2,
}

export const needSetTrueLocalKey = (lastChecked, currChecked) => {
    return (!lastChecked || currChecked) ? false : true;
}



