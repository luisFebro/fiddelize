const User = require("../../models/user/User");
const getCurrPlan = require("./helpers/getCurrPlan");
const getReferenceData = require("./helpers/getReferenceData");
// const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone; // America/Manaus
// DEPRACATED - use isScheduledDate method to not include the current expiring date in the frontend's FNS date lib.
// Use the nextExpiryDate to compare.
// const isBefore = require('date-fns/isBefore');
// is the first date before the second date ? isBefore returns true if both dates are today, replacing isToday method.

const isPaid = (transactionStatus) =>
    transactionStatus === "pago" || transactionStatus === "disponível";

exports.mwDiscountProCredits = (req, res, next) => {
    const {
        userId = "5e8b0bfc8c616719b01abc9c",
        service = "Novvos Clientes",
    } = req;

    User.findById(userId).exec((err, user) => {
        if (err || !user)
            return res.status(404).json({ error: "user not found" });

        const planList = user.clientAdminData.bizPlanList;
        if (!planList.length) return res.json(false);

        const numCredits = 1;
        let newBalance;
        const discountedList = planList.map((servObj) => {
            if (servObj.service === service) {
                const discountNow = servObj.creditEnd - numCredits;
                servObj.creditEnd = discountNow;
                newBalance = discountNow;
                return servObj;
            }

            return servObj;
        });

        user.clientAdminData.bizPlanList = discountedList;
        // modifying an array requires we need to manual tell the mongoose the it is modified. reference: https://stackoverflow.com/questions/42302720/replace-object-in-array-in-mongoose
        user.markModified("clientAdminData.bizPlanList");

        user.save((err) => {
            res.json(
                `It was discounted 1 credit from service ${service}. New balance is ${newBalance} `
            );
            // next();
        });
    });
};

// GET - goal is to change welcome message to direct pay after first transaction.
exports.getProData = (req, res) => {
    const { userId, nextExpiryDate } = req.query;
    User.findById(userId)
        .select("clientAdminData.orders clientAdminData.bizPlanList")
        .exec((err, data) => {
            if (err || !data)
                return res.status(404).json({ error: "something went wrong" });
            const orders = data.clientAdminData.orders;
            const bizPlanList = data.clientAdminData.bizPlanList;
            const isBizPlanValid = bizPlanList && bizPlanList.length;
            const isOrdersValid = orders && orders.length;

            let isPro = false;
            let totalScore = 0;
            let nextExOrdersStat;
            let nextExRef;
            let nextExTotalMoney;
            // To have this  nextEx data, both planDueDate and usageTimeEnd dates should be the same.
            totalScore =
                isOrdersValid &&
                orders.reduce((acc, next) => {
                    let invest = 0;
                    if (
                        JSON.stringify(nextExpiryDate) ===
                        JSON.stringify(next.planDueDate)
                    ) {
                        nextExOrdersStat = next.ordersStatement;
                        nextExRef = next.reference;
                        nextExTotalMoney = next.investAmount;
                    }

                    if (isPaid(next.transactionStatus)) {
                        isPro = true;
                        invest = Number(next.investAmount);
                    }

                    return acc + invest;
                }, 0);

            let nextExPlan;
            let nextExTotalServ = 0;
            isBizPlanValid &&
                bizPlanList.forEach((s) => {
                    if (
                        JSON.stringify(nextExpiryDate) ===
                        JSON.stringify(s.usageTimeEnd)
                    ) {
                        ++nextExTotalServ;
                        nextExPlan = s.plan;
                    }
                });

            let mainRef = orders.length && orders[0].reference; //IMPORTANT: only to verify if the last added order is gold or in case of the first order to return the current plan. first order ref from list
            const plan = !orders.length
                ? "gratis"
                : getCurrPlan(orders, { mainRef });

            const expiryData = {
                nextExPlan,
                nextExTotalServ,
                nextExOrdersStat,
                nextExRef,
                nextExTotalMoney,
            };

            res.json({
                isPro,
                totalScore,
                plan,
                nextExpiryServData: expiryData,
                bizPlanList,
            });
        });
};

exports.getNextExpiryDate = (req, res) => {
    const { userId } = req.query;

    User.findById(userId)
        .select("clientAdminData.bizPlanList")
        .exec((err, user) => {
            if (err || !user)
                return res.status(404).json({ error: "user not found" });

            const planList = user.clientAdminData.bizPlanList || [];
            if (!planList.length) return res.json(false);

            const datesList = planList.map((serv) => {
                return serv.usageTimeEnd;
            });

            const minDate = new Date(Math.min(...datesList));

            res.json(minDate);
        });
};

// DELETE
exports.removeProServices = (req, res) => {
    const { userId, nextExpiryDate } = req.query;
    if (!nextExpiryDate)
        return res
            .status(400)
            .json({ error: "missing nextExpiryDate string!" });

    User.findById(userId).exec((err, user) => {
        if (user.role !== "cliente-admin")
            res.status(401).json({
                error: "Você não tem permissão para acessar esta API",
            });
        if (err || !user)
            return res.status(404).json({ error: "user not found" });

        const planList = user.clientAdminData.bizPlanList;
        if (!planList.length) return res.json(false);

        const removedList = [];
        let totalRemovedServices = 0;
        planList.forEach((servObj) => {
            const isExpired =
                JSON.stringify(nextExpiryDate) ===
                JSON.stringify(servObj.usageTimeEnd); // LESSON: dates from mongoDB is an object. need JSON.stringify to compare correctly. Even the string date requires it otherwise it will fail
            if (isExpired) {
                ++totalRemovedServices;
                return;
            }

            removedList.push(servObj);
        });

        user.clientAdminData.bizPlanList = removedList;
        // modifying an array requires we need to manual tell the mongoose the it is modified. reference: https://stackoverflow.com/questions/42302720/replace-object-in-array-in-mongoose
        user.markModified("clientAdminData.bizPlanList");

        user.save((err) => {
            res.json(
                `It was removed ${totalRemovedServices} services. Now have ${
                    planList ? planList.length - totalRemovedServices : 0
                }`
            );
        });
    });
};
