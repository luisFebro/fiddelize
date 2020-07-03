exports.findOneAndUpdate = (User, options = {}) => {
    const { res, _id, currCard, lastCard } = options;

    let unshiftThis;
    if(lastCard) {
        unshiftThis = { $each: [currCard, lastCard], $position: 0 }; // insert as the first array's element.
    } else {
        unshiftThis = { $each: [currCard], $position: 0 }; // insert as the first array's element.
    }

    const objToPush = { "clientUserData.purchaseHistory": unshiftThis };

    return User.findOneAndUpdate(
        { _id },
        { $push: objToPush },
        { new: false }
    ).exec((err, historyList) => {
        if(err) return res.status(500).json({ error: err });
        res.json("User purchase's history updated. LAST DATE: " + new Date());
    });
}

function areObjsEqual(obj1, obj2) {
    if(!obj1 || !obj2) return false;
     return JSON.stringify(obj1) === JSON.stringify(obj2);
}

exports.confirmPrizeStatus = (arrayOfData, opts = {}) => {
    const { challengeN, statusType } = opts;
    let status = "FAIL";

    if(!arrayOfData) return { error: "the array should have at least one object, but found none.", status }
    if(!challengeN || typeof challengeN !== "number") return { error: "no challengeN specified as option or invalid format. it should be number", status };
    if(!["received", "confirmed"].includes(statusType)) return { error: `the option statusType should be either "confirmed" or "received"`, status };

    const keys = {
        received: 'isPrizeReceived',
        confirmed: 'isPrizeConfirmed',
    }

    let foundObjIndex = undefined;
    let foundPrize = arrayOfData.find((register, ind) => {
        const condition = register.cardType === "prize" && register.challengeN === challengeN
        if(condition) {
            foundObjIndex = ind;
            return condition;
        }
    });

    const keyToSet = keys[statusType];

    if(typeof foundObjIndex !== "undefined") {
        const targetObj = arrayOfData[foundObjIndex];
        targetObj[keyToSet] = true;
        status = "OK";
    } else {
        return {
            status,
            error: `the challenge N.º ${challengeN} was not found`
        }
    }

    return {
        arrayOfData,
        status
    };
}

/* e.g confirmPrizeStatus
const res = confirmPrizeStatus(arrayOfData, { challengeN: 1, statusType: "confirmed" });
console.log("res", res);
{ arrayOfData:
   [ { cardType: 'prize',
       createdAt: '2020-06-22T02:28:13.435Z',
       value: 0,
       _id: '5ef022c259de0817bc16dbfe',
       desc: '',
       isPrizeReceived: false,
       isPrizeConfirmed: true,
       challengeN: 1 },
     { cardType: 'record',
       createdAt: '2020-06-22T02:41:42.611Z',
       value: 210,
       _id: '5ef01a6659de0817bc16dbfb',
       icon: 'star',
       challengeN: 1,
       desc: 'Última Compra 2' },
     { cardType: 'record',
       createdAt: '2020-06-22T02:16:23.510Z',
       value: 110,
       _id: '5ef0147778e8081af8eb8b78',
       icon: 'star',
       challengeN: 1,
       desc: 'Última Compra 1' } ],
  status: 'OK' }
*/

/* ARCHIVES
This is replaced the the totalPurchasePrize variable in the db itself
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