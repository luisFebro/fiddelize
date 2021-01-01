const setUserOrderInDB = require("./helpers/setUserOrderInDB");

async function handleBankDebit({ payload, paymentLink }) {
    const orderData = {
        ...payload,
        paymentLink,
    };

    const responseOrder = await setUserOrderInDB(orderData).catch((err) => {
        res.status(500).json({ error: err });
    });
    if (!responseOrder) return;
}

module.exports = handleBankDebit;
