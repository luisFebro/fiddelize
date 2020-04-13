

function generateHistoryData(lastPurchaseObj = {}, scores = {}) {
    let { challengeN, purchaseLength, cardType, value, icon, createdAt } = lastPurchaseObj;
    const { rewardScore, currScore } = scores;

    let currentPurchase = {};
    let lastPurchase = {}; // this overrides the desc value from last pruchases.

    const cliUserBeatedGoal = currScore >= Number(rewardScore);
    const currPurchaseCount = purchaseLength + 1;
    const lastPurchaseCount = currPurchaseCount - 1;

    let defaultObj = { challengeN: challengeN, cardType: 'record', desc: '', createdAt: new Date() };

    if(!purchaseLength && !cliUserBeatedGoal) {
        currentPurchase = { ...defaultObj, desc: 'Primeira Compra' };
        return [currentPurchase];
    }

    if(purchaseLength === 1 && !cliUserBeatedGoal) {
        currentPurchase = { ...defaultObj, desc: `Última Compra ${currPurchaseCount}` };
        return [currentPurchase];
    }


    if(cardType === "prize") {
        currentPurchase = { challengeN: ++challengeN, cardType: 'record', desc: `Última Compra ${lastPurchaseCount}`, createdAt: new Date()};
        // lastPurchase = { challengeN: challengeN, cardType: 'record', desc: `Compra ${lastPurchaseCount}`, value, icon, createdAt };
        return [currentPurchase];
    }


    if(purchaseLength >= 2) {
        currentPurchase = { ...defaultObj, desc: `Última Compra ${currPurchaseCount}` };
        lastPurchase = { ...defaultObj, desc: `Compra ${lastPurchaseCount}`, value, icon, createdAt };
        return [ currentPurchase, lastPurchase ];
    }

    if(cliUserBeatedGoal) {
        currentPurchase = { challengeN: challengeN, cardType: 'record', desc: `Última Compra ${currPurchaseCount}`, createdAt: new Date(), needPrize: true};
        return [currentPurchase];
    }

}

module.exports = generateHistoryData;

// const lastPurchase = {
//    challengeN: 2,
//    purchaseLength: 2,
//    value: 50,
//    icon: "star",
//    createdAt: new Date(),
//    cardType: "prize",
// }

// const scores = {
//     rewardScore: 500,
//     currScore: 501,
// }

// const [currHistoryData, lastHistoryData] = generateHistoryData(lastPurchase, scores);
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


