let generatedPrizeCard = {
    cardType: 'prize',
    desc: ``,
    isPrizeReceived: false,
    isPrizeConfirmed: false,
    createdAt: new Date(),
};

// if challenge number from cards is different, then add a prize card
// check if the curr chall card is different from the second from top to bottom until the end of the lsit
const didCardsChanged = (firstCard, historyDataArray, options = {}) => {
    let { secondCard } = options;
    if(!secondCard) return false;

    const cardsChanged = secondCard.challengeN !== firstCard.challengeN;

    return cardsChanged;
}

const addPrize = (newArray, options = {}) => {
    const { currChall, isFirstCardPrize, cardsChanged, unshift } = options;
    if(isFirstCardPrize) return;

    const prizeCardNumber = cardsChanged ? (--currChall) : currChall; // --currChall is the last cardnumber, not the new added one
    generatedPrizeCard = { ...generatedPrizeCard, challengeN: prizeCardNumber };

    if(unshift) {
        newArray.unshift(generatedPrizeCard);
    } else {
        newArray.push(generatedPrizeCard);
    }
}

function generatePrizeCard(historyDataArray, scores = {}) {
    if(!historyDataArray) throw new Error("No array as the first argument")
    const isValidArray = Boolean(historyDataArray.length);

    const { rewardScore, currScore } = scores;
    console.log("currScore", typeof currScore);
    console.log("rewardScore", typeof rewardScore);

    let newArray = [];

    const currChall = isValidArray && historyDataArray[0].challengeN;

    let addedNewChall = false;
    isValidArray && historyDataArray.forEach((elem, ind) => {
        const needPrize = elem.needPrize;

        const isChallNumbersDiff = didCardsChanged(elem, historyDataArray, { secondCard: historyDataArray[ind + 1] });
        const needAddPrize = (isChallNumbersDiff && !addedNewChall) || needPrize;
        if(needAddPrize) {
            // removing ÚLTIMO title after add a new prize to avoid duplicated last card in the history
            elem.desc = elem.desc.replace("Última Compra", "Compra");
            addPrize(newArray, { currChall, cardsChanged: isChallNumbersDiff });

            addedNewChall = true;
        }

        if(!isChallNumbersDiff) newArray.push(elem);
    })

    const cliUserBeatedGoal = currScore >= Number(rewardScore);
    if(cliUserBeatedGoal) {
        const firstElem = newArray[0];
        firstElem.desc = firstElem.desc.replace("Última Compra", "Compra");
        addPrize(newArray, { currChall, unshift: true, isFirstCardPrize: firstElem.cardType === "prize" });

        const remainder = currScore - rewardScore;
        if(remainder) {
            const remainderCard = { cardType: 'remainder', remainderValue: remainder }
            newArray.unshift(remainderCard);
        }
    }

    return newArray;
}

module.exports = generatePrizeCard;

/* ARCHIVES
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