const pricing = {
    gold: {
        price: {
            yearly: 1500,
            monthly: 150,
        },
        credit: {
            yearly: 888, // 888 means limitless
            monthly: 888,
        },
    },
    silver: {
        price: {
            yearly: 1000,
            monthly: 100,
        },
        "Novvos Clientes": {
            credit: {
                yearly: 24000,
                monthly: 2000,
            },
        },
        "Novvos Membros": {
            credit: {
                yearly: 10,
                monthly: 10,
            },
        },
    },
    bronze: {
        price: {},
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
    gold: pricing.gold.price[period],
    silver: pricing.silver.price[period],
    bronze: pricing.bronze["Novvos Clientes"].prices[period][0],
});

export { getMinPrice };
