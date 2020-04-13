exports.findOneAndUpdate = (User, res, _id, unshiftThis, currDoc, newTotalScore) => {
    const historyData = currDoc.purchaseHistory;
    const totalPurchasePrize = countPurchasePrizes(historyData);
    const objToSet = { "clientUserData.totalGeneralScore": newTotalScore, "clientUserData.totalPurchasePrize": totalPurchasePrize };
    const objToPush = { "clientUserData.purchaseHistory": unshiftThis };

    return User.findOneAndUpdate(
        { _id },
        { $set: objToSet, $push: objToPush },
        { new: false }
    )
    .exec((err, historyList) => {
        if(err) return res.status(500).json(msgG('error.systemError', err))
        res.json("User purchase's history updated.");
    });
}


exports.countPurchasePrizesOnly = arrayOfData => {
    if(!arrayOfData.length) return 0;

    return arrayOfData.reduce((acc, next) => {
        const condition = next.cardType === "prize";
        const nextValue = condition ? 1 : 0; // if find elem wich does not have value, then zero.
        return acc + nextValue;
    }, 0)
}

const countPurchasePrizes = arrayOfData => {
    if(!arrayOfData.length) return 0;

    return arrayOfData.reduce((acc, next) => {
        const condition = next.cardType === "prize" && next.isPrizeConfirmed === true;
        const nextValue = condition ? 1 : 0; // if find elem wich does not have value, then zero.
        return acc + nextValue;
    }, 0)
}

// This was not counting properly when user scored for the first time.
// countPurchaseTotal = arrayOfData => {
//     if(!arrayOfData.length) return 0;

//     return arrayOfData.reduce((acc, next) => {
//         const nextValue = next.value ? next.value : 0; // if find elem wich does not have value, then zero.
//         return acc + nextValue;
//     }, 0)
// }

exports.confirmPrizeStatus = (arrayOfData, opts) => {
    const { statusType } = opts;
    const newArray = [];
    console.log(arrayOfData);
    console.log(statusType);

    return newArray;
}



/* ARCHIVES
// exports.checkIfHasUncheckedPrize = (arrayOfData) => {
//     if(!arrayOfData) return false;
//     const res = arrayOfData.find(obj => {
//         if(obj.cardType === "prize"
//             && obj.isPrizeReceived === false
//             && obj.isPrizeConfirmed === false) {
//             return obj;
//         } else {
//             return false;
//         }
//     })
//     return Boolean(res);
// }
*/