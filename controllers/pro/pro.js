const User = require("../../models/user/User");

// GET - goal is to change welcome message to direct pay after first transaction.
exports.isUserProAlready = (req, res) => {
    const { userId } = req.query;
    User.findById(userId)
        .select("clisentAdminData.orders")
        .exec((err, data) => {
            if (err || !data)
                return res.status(404).json({ error: "something went wrong" });
            const orders = data.clientAdminData.orders;

            const gotPaidTransaction = orders.find(
                (ord) => ord.transactionStatus === "pago"
            );

            let resCheck = false;
            if (gotPaidTransaction) {
                resCheck = true;
            }

            res.json(resCheck);
        });
};
