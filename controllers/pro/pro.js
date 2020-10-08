const User = require("../../models/user/User");
const getCurrPlan = require("./helpers/getCurrPlan");

const isPaid = (transactionStatus) =>
    transactionStatus === "pago" || transactionStatus === "disponível";

// GET - goal is to change welcome message to direct pay after first transaction.
exports.getProData = (req, res) => {
    const { userId } = req.query;
    User.findById(userId)
        .select("clientAdminData.orders")
        .exec((err, data) => {
            if (err || !data)
                return res.status(404).json({ error: "something went wrong" });
            const orders = data.clientAdminData.orders;

            let isPro = false;
            let totalScore = 0;
            const mainRef = orders.length && orders[0].reference; //first order ref from list
            const plan = !orders.length
                ? "gratis"
                : getCurrPlan(orders, { mainRef });

            totalScore = orders.reduce((acc, next) => {
                let invest = 0;
                if (isPaid(next.transactionStatus)) {
                    isPro = true;
                    invest = Number(next.investAmount);
                }

                return acc + invest;
            }, 0);

            res.json({
                isPro,
                totalScore,
                plan,
            });
        });
};
