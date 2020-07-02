const getLastCard = (lastCard, options = {}) => {
    const { totalNonPrizeCards } = options;
    return {
        challengeN: lastCard ? lastCard.challengeN : 1,
        value: totalNonPrizeCards && lastCard.value,
        icon: totalNonPrizeCards && lastCard.icon,
        createdAt: totalNonPrizeCards && lastCard.createdAt,
        cardType: totalNonPrizeCards && lastCard.cardType,
    }
}

function generateHistoryData(lastCardData, scores = {}, options = {}) {
    const { totalNonPrizeCards, reqBody } = options;
    const { value: currValue, icon: currIcon } = reqBody;
    let { challengeN, cardType, value, icon, createdAt } = getLastCard(lastCardData, { totalNonPrizeCards });
    const { rewardScore, currScore } = scores;

    let currCard = {};
    let lastCard = {}; // this overrides the desc value from last pruchases.

    const cliUserBeatedGoal = currScore >= Number(rewardScore);
    const lastCardNumber = challengeN;
    const nextCardNumber = totalNonPrizeCards + 1; // the next curr card on the top

    let defaultCard = {
        challengeN: challengeN,
        cardType: 'record',
        icon: currIcon,
        value: currValue,
        desc: '', createdAt: new Date(),
    };

    if(!totalNonPrizeCards && !cliUserBeatedGoal) {
        // only add the current card
        currCard = { ...defaultCard, desc: 'Primeira Compra' };
        return [currCard];
    }

    if(totalNonPrizeCards === 1 && !cliUserBeatedGoal) {
        // only add the current card
        currCard = { ...defaultCard, desc: `Última Compra ${nextCardNumber}` };
        return [currCard];
    }

    if(cardType === "prize" || cardType === "remainder") {
        // only card charge of leveling up challengeN from algorithm
        currCard = { challengeN: ++challengeN, cardType: 'record', desc: `Última Compra ${nextCardNumber}`, createdAt: new Date()};
        return [currCard];
    }


    if(totalNonPrizeCards >= 2) {
        // the lastCard will replace the last card with same number and currCard will be add too.
        currCard = { ...defaultCard, desc: `Última Compra ${nextCardNumber}` };
        lastCard = { ...defaultCard, desc: `Compra ${lastCardNumber}`, value, icon, createdAt };
        return [ currCard, lastCard ];
    }

    if(cliUserBeatedGoal) {
        currCard = {
            challengeN: challengeN,
            cardType: 'record',
            desc: `Última Compra ${nextCardNumber}`,
            createdAt: new Date(),
            needPrize: true
        };
        console.log('needPrize: true')
        return [currCard];
    }

}

module.exports = generateHistoryData;

// const lastCard = {
//    challengeN: 2,
//    totalNonPrizeCards: 2,
//    value: 50,
//    icon: "star",
//    createdAt: new Date(),
//    cardType: "prize",
// }

// const scores = {
//     rewardScore: 500,
//     currScore: 501,
// }

// const [currHistoryData, lastHistoryData] = generateHistoryData(lastCard, scores);
// console.log("lastHistoryData", lastHistoryData);
// console.log("currHistoryData", currHistoryData);

// #
/*
[ 'Primeira Compra',
  'Compra 2',
  'Compra 3',
  'Compra 4',
  'Última Compra' ]

*/


