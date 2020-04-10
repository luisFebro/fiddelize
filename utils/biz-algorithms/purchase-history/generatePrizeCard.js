function generatePrizeCard(historyDataArray, scores = {}) {
    if(!historyDataArray) throw new Error("No array as the first argument")
    const isValidArray = Boolean(historyDataArray.length);

    let newArray = [];
    const { rewardScore, currScore } = scores;

    let currChallengeN = isValidArray && historyDataArray[0].challengeN;
    const cliUserBeatedGoal = currScore >= rewardScore;

    let onlyOnceCheck = false;
    isValidArray && historyDataArray.forEach((elem, ind) => {
        const posNext = historyDataArray[ind + 1];
        const nextElem = posNext &&  posNext.challengeN;
        const currElem = elem.challengeN;
        const changedChallenge =  nextElem !== currElem;

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

module.exports = generatePrizeCard;

// const historyDataArray = [
//     { challengeN: 6, cardType: 'record', desc: 'Última Compra 13' },
//     { challengeN: 5, cardType: 'record', desc: 'Compra 12' },
//     { challengeN: 5, cardType: 'record', desc: 'Compra 11' },
//     { challengeN: 5, cardType: 'record', desc: 'Compra 10' },
//     { challengeN: 4, cardType: 'record', desc: 'Compra 9' },
//     { challengeN: 4, cardType: 'record', desc: 'Compra 8' },
//     { challengeN: 3, cardType: 'record', desc: 'Compra 7' },
//     { challengeN: 3, cardType: 'record', desc: 'Compra 6' },
//     { challengeN: 2, cardType: 'record', desc: 'Compra 5' },
//     { challengeN: 2, cardType: 'record', desc: 'Compra 4' },
//     { challengeN: 1, cardType: 'record', desc: 'Compra 3' },
//     { challengeN: 1, cardType: 'record', desc: 'Compra 2' },
//     { challengeN: 1, cardType: 'record', desc: 'Primeira Compra' },
// ];

// const scores = {
//     rewardScore: 500,
//     currScore: 501,
// }
// console.log(generatePrizeCard(historyDataArray, scores))

