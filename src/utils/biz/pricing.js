const pricing = {
    gold: {
        "Novvos Clientes": {
            price: {
                yearly: 1200,
                monthly: 120, // we have to give a price for each service even limitless. 20% diff from each main service
            },
            credit: {
                yearly: Infinity, // LESSON: Infinity when converted in JSON it will turn into null since Infinity is not a supported type. MongoDB automatically converts stringified Infinity into a number
                monthly: Infinity,
            },
        },
        "Connecta Membros": {
            price: {
                yearly: 300,
                monthly: 30,
            },
            credit: {
                yearly: Infinity,
                monthly: Infinity,
            },
        },
    },
    silver: {
        "Novvos Clientes": {
            price: {
                yearly: 800,
                monthly: 80, // we have to give a price for each service even limitless. 20% diff from each main service
            },
            credit: {
                yearly: 24000,
                monthly: 2000,
            },
        },
        "Connecta Membros": {
            price: {
                yearly: 200,
                monthly: 20,
            },
            credit: {
                yearly: 10,
                monthly: 10,
            },
        },
    },
    bronze: {
        "Novvos Clientes": {
            prices: {
                yearly: [300, 350, 396, 448, 500],
                monthly: [30, 35, 40, 45, 50],
                units: {
                    yearly: [0.0833, 0.0729, 0.0555, 0.0469, 0.0417], // it is credits / price note: it requires 4 decimal nubmers to produce the right value
                    monthly: [0.1, 0.087, 0.066, 0.056, 0.05],
                },
            },
            credits: {
                yearly: [3600, 4800, 7200, 9600, 12000], // it is monthly value x 12 for a year
                monthly: [300, 400, 600, 800, 1000],
            },
        },
        "Connecta Membros": {
            prices: {
                yearly: [50, 100, 150, 200, 250],
                monthly: [5, 10, 15, 20, 25],
                units: {
                    yearly: [50],
                    monthly: [5],
                },
            },
            credits: {
                yearly: [1, 2, 3, 4, 5],
                monthly: [1, 2, 3, 4, 5],
            },
        },
    },
};

export default pricing;

const getMinPrice = (period) => ({
    gold:
        pricing.gold["Novvos Clientes"].price[period] +
        pricing.gold["Connecta Membros"].price[period],
    silver:
        pricing.silver["Novvos Clientes"].price[period] +
        pricing.silver["Connecta Membros"].price[period],
    bronze: pricing.bronze["Novvos Clientes"].prices[period][0],
});

const getMaxCredit = (period) => ({
    // gold is limitless
    // note that for silver is credit because it is a single number, differently from credits being an array with multiple numbers.
    silver: {
        "Novvos Clientes": pricing.silver["Novvos Clientes"].credit[period],
        "Connecta Membros": pricing.silver["Connecta Membros"].credit[period],
    },
    bronze: {
        "Novvos Clientes": pricing.bronze["Novvos Clientes"].credits[
            period
        ].slice(-1)[0],
        "Connecta Membros": pricing.bronze["Connecta Membros"].credits[
            period
        ].slice(-1)[0],
    },
});

export { getMinPrice, getMaxCredit };
