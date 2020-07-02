

function generateHistoryData(lastPurchaseObj = {}, scores = {}) {
    let { challengeN, totalNonPrizeCards, cardType, value, icon, createdAt } = lastPurchaseObj;
    const { rewardScore, currScore } = scores;

    let currCard = {};
    let lastCard = {}; // this overrides the desc value from last pruchases.

    const cliUserBeatedGoal = currScore >= Number(rewardScore);
    const nextCardNumber = totalNonPrizeCards + 1; // the next curr card on the top
    const lastCardNumber = totalNonPrizeCards;

    let defaultObj = { challengeN: challengeN, cardType: 'record', desc: '', createdAt: new Date() };

    if(!totalNonPrizeCards && !cliUserBeatedGoal) {
        // only add the current card
        currCard = { ...defaultObj, desc: 'Primeira Compra' };
        return [currCard];
    }

    if(totalNonPrizeCards === 1 && !cliUserBeatedGoal) {
        // only add the current card
        currCard = { ...defaultObj, desc: `Última Compra ${nextCardNumber}` };
        return [currCard];
    }

    if(cardType === "prize" || cardType === "remainder") {
        // only add the current card
        currCard = { challengeN: ++challengeN, cardType: 'record', desc: `Última Compra ${nextCardNumber}`, createdAt: new Date()};
        return [currCard];
    }


    if(totalNonPrizeCards >= 2) {
        // the lastCard will replace the last card with same number and currCard will be add too.
        currCard = { ...defaultObj, desc: `Última Compra ${nextCardNumber}` };
        lastCard = { ...defaultObj, desc: `Compra ${lastCardNumber}`, value, icon, createdAt };
        return [ currCard, lastCard ];
    }

    if(cliUserBeatedGoal) {
        currCard = { challengeN: challengeN, cardType: 'record', desc: `Última Compra ${nextCardNumber}`, createdAt: new Date(), needPrize: true};
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


