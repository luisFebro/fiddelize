export default function pickCurrChallData(rewardList, totalPrizesInd) {
    if (!rewardList)
        return {
            milestoneIcon: "star",
            targetPoints: 800,
            mainReward: "smt",
        };

    const prizeInd = !totalPrizesInd ? 0 : totalPrizesInd;

    // change the original names to respectively rewardList ones...
    const keyAvalaible = {
        milestoneIcon: "icon",
        targetPoints: "targetPoints",
        mainReward: "rewardDesc",
    };

    const isProgressMode = rewardList.length > 1;

    const getValues = (selectedObj) => {
        const values = {
            milestoneIcon: selectedObj[keyAvalaible.milestoneIcon],
            targetPoints: selectedObj[keyAvalaible.targetPoints],
            mainReward: selectedObj[keyAvalaible.mainReward],
        };

        return values;
    };

    if (isProgressMode) {
        // Repeat the last challenge if there is no more of them in the cli-admin list
        let newObjValues = rewardList[prizeInd];
        if (!newObjValues && prizeInd !== 0) {
            const lastValidInd = rewardList.length - 1;
            newObjValues = rewardList[lastValidInd];
        }
        return getValues(newObjValues);
    }
    const sameValues = rewardList[0];
    return getValues(sameValues);
}

/*
EXEMPLE>
const rewardList = [{
    icon: 'star',
    targetPoints: 500,
    rewardDesc: "presentinho",
},
{
    icon: 'dragon',
    targetPoints: 700,
    rewardDesc: "celualr",
},];


let targetPoints = 500;
const pickedObj = pickCurrChallData(rewardList, 0);
targetPoints = pickedObj["targetPoints"];
console.log("targetPoints", targetPoints); // 700
 */
