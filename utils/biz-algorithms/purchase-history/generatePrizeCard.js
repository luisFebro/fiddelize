let generatedPrizeCard = {
    cardType: 'prize',
    desc: ``,
    isPrizeReceived: false,
    isPrizeConfirmed: false,
    createdAt: new Date(),
};


// This algorithm will detect the last unchecked prize and then it will ignore all others above.historyDataArray
// This is because the prize should appears right after the goal is achieved.
// In this condition, one buggy situation happens which is another prize card merges on the top of the first again.
const findLastUncheckedPrize = newArray => {
    if(!newArray.length) return [];
    newArray = newArray.reverse();

    const filteredArray = [];

    let foundUncheckedPrize = false;
    newArray.forEach(obj => {
        const isUnchecked = obj.cardType === "prize" && obj.isPrizeReceived === false && obj.isPrizeConfirmed === false;
        if(obj.cardType === "record") {
            filteredArray.push(obj);
        }

        if(obj.cardType === "prize") {
            if(!foundUncheckedPrize) {
                filteredArray.push(obj);
                foundUncheckedPrize = true;
            }
        }
    })

    return filteredArray.reverse();
}

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
        const nextElem = posNext && posNext.challengeN;
        const currElem = elem.challengeN;
        const changedChallenge = nextElem !== currElem;

        if(cliUserBeatedGoal && !onlyOnceCheck) {
            generatedPrizeCard = { ...generatedPrizeCard, challengeN: currChallengeN };
            newArray.push(generatedPrizeCard);
            onlyOnceCheck = true;
        }

        if(changedChallenge) {
            generatedPrizeCard = { ...generatedPrizeCard, challengeN: --currChallengeN };
            if(generatedPrizeCard.challengeN !== 0) {
                newArray.push(generatedPrizeCard);
            }
            newArray.push(elem);
        } else {
            newArray.push(elem);
        }

    })

    const filteredPrizeArray = findLastUncheckedPrize(newArray);

    return filteredPrizeArray;
}

module.exports = generatePrizeCard;

// const historyDataArray =
// [
//     { cardType: 'record',
//       createdAt: '2020-04-11T17:08:09.533Z',
//       _id: '5e9212a5fd071a081cc37c90',
//       icon: 'star',
//       value: 100.45,
//       challengeN: 1,
//       desc: 'Compra 9' },
//     { cardType: 'record',
//       createdAt: '2020-04-11T17:08:09.533Z',
//       _id: '5e9212a5fd071a081cc37c90',
//       icon: 'star',
//       challengeN: 1,
//       desc: 'Compra 9' },
//    { cardType: 'record',
//      createdAt: '2020-04-11T17:08:09.533Z',
//      value: 90,
//      _id: '5e9212a5fd071a081cc37c90',
//      icon: 'star',
//      challengeN: 1,
//      desc: 'Compra 9' },
//    { cardType: 'record',
//      createdAt: '2020-04-11T16:58:46.021Z',
//      value: 10,
//      _id: '5e91f9aeb04248164c19e94e',
//      icon: 'star',
//      challengeN: 1,
//      desc: 'Compra 8' },
//    { cardType: 'record',
//      createdAt: '2020-04-11T16:56:40.397Z',
//      value: 70,
//      _id: '5e91f8160ef78c14c4ab2a62',
//      icon: 'star',
//      challengeN: 1,
//      desc: 'Compra 7' },
//    { cardType: 'record',
//      createdAt: '2020-04-11T16:46:51.745Z',
//      value: 30,
//      _id: '5e91f70420c72006ac3b8e1b',
//      icon: 'star',
//      challengeN: 1,
//      desc: 'Compra 6' },
//    { cardType: 'record',
//      createdAt: '2020-04-11T16:42:43.334Z',
//      value: 60,
//      _id: '5e91f4dc0870fe0e58aae581',
//      icon: 'star',
//      challengeN: 1,
//      desc: 'Compra 5' },
//    { cardType: 'record',
//      createdAt: '2020-04-11T16:36:25.772Z',
//      value: 30,
//      _id: '5e91f406563aec14a49f625b',
//      icon: 'star',
//      challengeN: 1,
//      desc: 'Compra 4' },
//    { cardType: 'record',
//      createdAt: '2020-04-11T16:31:21.932Z',
//      value: 10,
//      _id: '5e91f331fb97b609583f56bf',
//      icon: 'star',
//      challengeN: 1,
//      desc: 'Compra 3' },
//    { cardType: 'record',
//      createdAt: '2020-04-11T16:23:39.271Z',
//      value: 150,
//      _id: '5e91f196ad74cd0914142e3f',
//      icon: 'star',
//      challengeN: 1,
//      desc: 'Compra 2' },
//    { cardType: 'record',
//      createdAt: '2020-04-11T16:15:55.162Z',
//      value: 50,
//      _id: '5e91ed865cfefa1e94beb6e6',
//      icon: 'star',
//      challengeN: 1,
//      desc: 'Primeira Compra' } ]

// console.log(countPurchaseTotal(historyDataArray));
// const scores = {
//     rewardScore: 500,
//     currScore: 499,
// }

// const generatedData = generatePrizeCard(historyDataArray, scores);
// console.log("generatedData", generatedData);
