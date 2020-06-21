export default function pickCurrChallData(rewardList, totalChallenges) {
    const prizeInd = !totalChallenges ? 0 : totalChallenges;

    // change the original names to respectively rewardList ones...
    const keyAvalaible = {
        selfMilestoneIcon: 'icon',
        rewardScore: 'rewardScore',
        mainReward: 'rewardDesc',
    }

    const isProgressMode = rewardList.length > 1;

    const getValues = selectedObj => {
        const values = {
            selfMilestoneIcon: selectedObj[keyAvalaible.selfMilestoneIcon],
            rewardScore: selectedObj[keyAvalaible.rewardScore],
            mainReward: selectedObj[keyAvalaible.mainReward],
        }

        return values;
    }

    if(isProgressMode) {
        const newObjValues = rewardList[prizeInd];
        return getValues(newObjValues);
    } else {
        const sameValues = rewardList[0];
        return getValues(sameValues);
    }
}

/*
EXEMPLE>
const rewardList = [{
    icon: 'star',
    rewardScore: 500,
    rewardDesc: "presentinho",
},
{
    icon: 'dragon',
    rewardScore: 700,
    rewardDesc: "celualr",
},];


let rewardScore = 500;
const pickedObj = pickCurrChallData(rewardList, 0);
rewardScore = pickedObj["rewardScore"];
console.log("rewardScore", rewardScore); // 700
 */