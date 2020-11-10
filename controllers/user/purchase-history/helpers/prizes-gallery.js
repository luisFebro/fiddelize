exports.insertElemWithPlaceholder = ({ elemList, placeholderList }) => {
    const elemListTotal = elemList.length;
    const placeholderTotal = placeholderList.length;

    const dontNeedPlaceholder = elemListTotal >= placeholderTotal;
    if (dontNeedPlaceholder) return elemList;

    const startingPoint = placeholderTotal - elemListTotal;
    const onlyNeededPlaceholders = placeholderList.slice(0, startingPoint);

    return [...onlyNeededPlaceholders, ...elemList];
};

// const elemList = [{ type: 'new', "challN": 1 }];
// const placeholderList = [{ "type": "secret", "challN": 2 }, { "type": "secret", "challN": 1 }]
// const res = insertElemWithPlaceholder({ elemList, placeholderList })
// console.log("res", res); // res [ { type: 'secret', challN: 2 }, { type: 'new', challN: 1 } ]

exports.getTrophyData = (cliPrize, trophyType = "custom") => {
    const {
        _id,
        challengeN,
        isPrizeReceived,
        isPrizeConfirmed,
        isPrizeExpired,
        icon,
        desc,
        value,
        createdAt,
    } = cliPrize;

    const data = {
        _id,
        type: trophyType,
        challN: challengeN,
        challIcon: icon,
        prizeDesc: desc,
        isConfirmed: isPrizeConfirmed,
        isDelivered: isPrizeReceived,
        isExpired: isPrizeExpired,
        finalGoal: value,
        createdAt,
    };

    return data;
};

exports.defaultSemisecret = ({ challIcon, finalGoal, challN, prizeDesc }) => ({
    // users will see trophy as silouette, but with icon and scores exposed
    type: "semisecret",
    challN,
    challIcon,
    finalGoal,
    prizeDesc,
});

exports.defaultSecret = ({ challN }) => ({
    // users will see trophy as silouette, no details
    type: "secret",
    challN,
});
