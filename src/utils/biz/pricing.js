const pricing = {
    gold: {
        "Novvos Clientes": {
            price: {
                yearly: 1400,
                monthly: 120, // we have to give a price for each service even limitless. In this gold plan case, it is 100 yearly, 30 monthly
            },
            credit: {
                yearly: Infinity,
                monthly: Infinity,
            },
        },
        "Novvos Membros": {
            price: {
                yearly: 100,
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
                yearly: 950,
                monthly: 50,
            },
            credit: {
                yearly: 24000,
                monthly: 2000,
            },
        },
        "Novvos Membros": {
            price: {
                yearly: 50, // 10 * 5
                monthly: 50,
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
        "Novvos Membros": {
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
        pricing.gold["Novvos Membros"].price[period],
    silver:
        pricing.silver["Novvos Clientes"].price[period] +
        pricing.silver["Novvos Membros"].price[period],
    bronze: pricing.bronze["Novvos Clientes"].prices[period][0],
});

const getMaxCredit = (period) => ({
    // gold is limitless
    // note that for silver is credit because it is a single number, differently from credits being an array with multiple numbers.
    silver: {
        "Novvos Clientes": pricing.silver["Novvos Clientes"].credit[period],
        "Novvos Membros": pricing.silver["Novvos Membros"].credit[period],
    },
    bronze: {
        "Novvos Clientes": pricing.bronze["Novvos Clientes"].credits[
            period
        ].slice(-1)[0],
        "Novvos Membros": pricing.bronze["Novvos Membros"].credits[
            period
        ].slice(-1)[0],
    },
});

export { getMinPrice, getMaxCredit };
