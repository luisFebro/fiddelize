let generatedPrizeCard = {
    cardType: 'prize',
    desc: ``,
    isPrizeReceived: false,
    isPrizeConfirmed: false,
    createdAt: new Date(),
};

const addBrief = (newArray, options = {}) => {
    const { currChall, rewardScore, } = options;
    const filteredRecordCards = newArray && newArray.filter(card => card.cardType === "record" && card.challengeN === currChall);
    // even if there is an empty array, it will return a default zero.
    const finishedScore = filteredRecordCards.reduce((acc, next) => acc + next.value, 0);
    const briefCard = { cardType: 'brief', value: rewardScore, finishedScore, desc: `Resumo desafio N.º ${currChall}` }
    newArray.unshift(briefCard);

    return finishedScore;
}

const addPrizeCard = (newArray, options = {}) => {
    const { currChall } = options;

    const prizeCardNumber = currChall;
    generatedPrizeCard = { ...generatedPrizeCard, challengeN: prizeCardNumber };

    newArray.unshift(generatedPrizeCard);
}

const addRemainder = (newArray, options = {}) => {
    let { currChall, challTotalScore, rewardScore } = options;

    const remainder = challTotalScore - rewardScore;
    if(remainder) {
        const remainderCard = { challengeN: ++currChall, cardType: 'remainder', value: remainder, desc: `Pontos Restantes` }
        newArray.unshift(remainderCard);
    }
}

function generatePrizeCard(historyDataArray, scores = {}) {
    if(!historyDataArray) throw new Error("No array as the first argument")
    const isValidArray = Boolean(historyDataArray.length);

    const { rewardScore, currScore } = scores;

    let newArray = historyDataArray;

    let currChall = isValidArray && historyDataArray[0].challengeN;

    const cliUserBeatedGoal = currScore >= Number(rewardScore);

    const firstElem = newArray[0];
    const generatePrize = () => {
        const skipIfLastCard = (firstElem.cardType === "prize" || firstElem.cardType === "remainder");
        const skipIfPendingChallenges = newArray && newArray.filter(card => card.cardType === "prize" && card.isPrizeConfirmed === false).length;
        if(skipIfLastCard || skipIfPendingChallenges) return false;
        return true;
    }

    if(cliUserBeatedGoal && generatePrize()) {
        firstElem.desc = firstElem.desc.replace("Última Compra", "Compra");

        let challTotalScore = addBrief(newArray, { currChall, rewardScore })
        addPrizeCard(newArray, { currChall });
        addRemainder(newArray, { challTotalScore, currChall, rewardScore })
    }

    return newArray;
}

module.exports = generatePrizeCard;

/* ARCHIVES
// if challenge number from cards is different, then add a prize card
// check if the curr chall card is different from the second from top to bottom until the end of the lsit
// const didCardsChanged = (firstCard, historyDataArray, options = {}) => {
//     let { secondCard } = options;
//     if(!secondCard) return false;

//     const cardsChanged = secondCard.challengeN !== firstCard.challengeN;

//     return cardsChanged;
// }

// let addedNewChall = false;
// isValidArray && historyDataArray.forEach((elem, ind) => {
//     // cliUserBeatedGoal is true in generateHistoryData...
//     const needPrize = elem.needPrize;

//     const isChallNumbersDiff = didCardsChanged(elem, historyDataArray, { secondCard: historyDataArray[ind + 1] });
//     const needAddPrize = (isChallNumbersDiff && !addedNewChall) || needPrize;
//     if(needAddPrize) {
//         console.log("adding prize from neddAppPrize");
//         // removing ÚLTIMO title after add a new prize to avoid duplicated last card in the history
//         elem.desc = elem.desc.replace("Última Compra", "Compra");
//         addPrize(newArray, { currChall, cardsChanged: isChallNumbersDiff });

//         addedNewChall = true;
//     }

//     newArray.push(elem); //if(!isChallNumbersDiff)
// })


// This algorithm will detect the last unchecked prize and then it will ignore all others above.historyDataArray
// This is because the prize should appears right after the goal is achieved.
// In this condition, one buggy situation happens which is another prize card merges on the top of the first again.
// const findLastUncheckedPrize = newArray => {
//     if(!newArray.length) return [];
//     newArray = newArray.reverse();

//     const filteredArray = [];

//     let foundUncheckedPrize = false;
//     newArray.forEach(obj => {
//         const isUnchecked = obj.cardType === "prize" && obj.isPrizeReceived === false && obj.isPrizeConfirmed === false;
//         if(obj.cardType === "record") {
//             filteredArray.push(obj);
//         }

//         // ignore all others above if by change user win more than one prize
//         if(obj.cardType === "prize" && isUnchecked) {
//             if(!foundUncheckedPrize) {
//                 filteredArray.push(obj);
//                 foundUncheckedPrize = true;
//             }
//         }
//     })

//     console.log("filteredArray", filteredArray);
//     return filteredArray.reverse();
// }
 */