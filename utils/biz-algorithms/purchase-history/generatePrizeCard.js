function generatePrizeCard(historyDataArray, scores = {}) {
    if(!historyDataArray) throw new Error("No array as the first argument")
    if(!historyDataArray.length) throw new Error("There is no items in the array")
    const { rewardScore, currScore } = scores;

    let newArray = [];

    let currChallengeN = historyDataArray[0].challengeN;
    console.log("currChallengeN", currChallengeN);

    const cliUserBeatedGoal = currScore >= rewardScore;
    let onlyOnceCheck = false;
    historyDataArray.forEach((elem, ind) => {
        const next = historyDataArray[ind + 1] &&  historyDataArray[ind + 1].challengeN;
        const current = elem.challengeN;
        const changedChallenge =  next !== current;

        if(cliUserBeatedGoal && !onlyOnceCheck) {
            const generatedCard = { challengeN: currChallengeN, cardType: 'prize', desc: ``};
            newArray.push(generatedCard);
            onlyOnceCheck = true;
        }

        if(changedChallenge) {
            newArray.push(elem);
            const generatedCard = { challengeN: --currChallengeN, cardType: 'prize', desc: ``};
            if(generatedCard.challengeN !== 0) {
                newArray.push(generatedCard);
            }
        } else {
            newArray.push(elem);
        }
    })

    return newArray;
}

// module.exports = generatePrizeCard;

const historyDataArray = [
    { challengeN: 6, cardType: 'record', desc: 'Última Compra 13' },
    { challengeN: 5, cardType: 'record', desc: 'Compra 12' },
    { challengeN: 5, cardType: 'record', desc: 'Compra 11' },
    { challengeN: 5, cardType: 'record', desc: 'Compra 10' },
    { challengeN: 4, cardType: 'record', desc: 'Compra 9' },
    { challengeN: 4, cardType: 'record', desc: 'Compra 8' },
    { challengeN: 3, cardType: 'record', desc: 'Compra 7' },
    { challengeN: 3, cardType: 'record', desc: 'Compra 6' },
    { challengeN: 2, cardType: 'record', desc: 'Compra 5' },
    { challengeN: 2, cardType: 'record', desc: 'Compra 4' },
    { challengeN: 1, cardType: 'record', desc: 'Compra 3' },
    { challengeN: 1, cardType: 'record', desc: 'Compra 2' },
    { challengeN: 1, cardType: 'record', desc: 'Primeira Compra' },
];

const scores = {
    rewardScore: 500,
    currScore: 501,
}
console.log(generatePrizeCard(historyDataArray, scores))

