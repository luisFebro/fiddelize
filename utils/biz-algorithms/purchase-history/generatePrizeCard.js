let generatedCard = {
    cardType: 'prize',
    desc: ``,
    isPrizeReceived: false,
    isPrizeConfirmed: false
};

function generatePrizeCard(historyDataArray, scores = {}) {
    if(!historyDataArray) throw new Error("No array as the first argument")
    const isValidArray = Boolean(historyDataArray.length);

    let newArray = [];
    const { rewardScore, currScore } = scores;

    let currChallengeN = isValidArray && historyDataArray[0].challengeN;
    const cliUserBeatedGoal = currScore >= Number(rewardScore);

    let onlyOnceCheck = false;
    isValidArray && historyDataArray.forEach((elem, ind) => {
        const posNext = historyDataArray[ind + 1];
        const nextElem = posNext &&  posNext.challengeN;
        const currElem = elem.challengeN;
        const changedChallenge =  nextElem !== currElem;

        if(cliUserBeatedGoal && !onlyOnceCheck) {
            generatedCard = { ...generatedCard, challengeN: currChallengeN };
            newArray.push(generatedCard);
            onlyOnceCheck = true;
        }

        if(changedChallenge) {
            newArray.push(elem);
            generatedCard = { ...generatedCard, challengeN: --currChallengeN };
            if(generatedCard.challengeN !== 0) {
                newArray.push(generatedCard);
            }
        } else {
            newArray.push(elem);
        }
    })

    return newArray;
}

module.exports = generatePrizeCard;

// const historyDataArray = [
//     { challengeN: 1, cardType: 'record', desc: 'Primeira Compra' },
// ];

// const scores = {
//     rewardScore: 500,
//     currScore: 501,
// }
// console.log(generatePrizeCard(historyDataArray, scores))

