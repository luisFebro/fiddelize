const User = require("../../models/user/User");
const getCurrPlan = require("./helpers/getCurrPlan");
const getReferenceData = require("./helpers/getReferenceData");
const { msg } = require("../_msgs/auth");
// const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone; // America/Manaus
// DEPRACATED - use isScheduledDate method to not include the current expiring date in the frontend's FNS date lib.
// Use the nextExpiryDate to compare.
// const isBefore = require('date-fns/isBefore');
// is the first date before the second date ? isBefore returns true if both dates are today, replacing isToday method.

// HELPERS
const isPaid = (transactionStatus) =>
    transactionStatus === "pago" || transactionStatus === "disponível";

const checkIfGotFreeCredits = ({ user, service }) => {
    const { bizPlan, bizFreeCredits, bizPlanList } = user.clientAdminData;

    const totalFreeUsers = bizFreeCredits ? bizFreeCredits[service] : 0;
    if (bizPlan === "gratis" && !totalFreeUsers) return false;

    return true;
};

// to avoid pro to add unthorized credits since the freeCredit method just verify if the user has a free account.
const checkIfServiceGotCredit = ({ user, service }) => {
    const { bizPlanList } = user.clientAdminData;

    if (!bizPlanList) return false;

    const needCheckPro = bizPlanList && bizPlanList.length;
    if (needCheckPro) {
        let foundService = false;
        bizPlanList.map((s) => {
            if (s.service === service) foundService = true;
        });

        return foundService;
    }

    return false;
};

const getDiscountedList = ({ bizPlanList, service }) => {
    const numCredits = 1;
    let balance;
    const list = bizPlanList.map((servObj) => {
        if (servObj.service === service) {
            const discountNow = servObj.creditEnd - numCredits;
            servObj.creditEnd = discountNow;
            balance = discountNow;
            return servObj;
        }

        return servObj;
    });

    return { list, balance };
};
// END HELPERS

exports.mwProCreditsCounter = (req, res, next) => {
    const { role, clientUserData, clientMemberData } = req.body;
    const isCliUser = role === "cliente";
    const service = isCliUser ? "Novvos Clientes" : "Novvos Membros";

    const isUserDiscountable = isCliUser || role === "cliente-membro";
    if (!isUserDiscountable) return next();

    const bizId =
        (clientUserData && clientUserData.bizId) ||
        (clientMemberData && clientMemberData.bizId);

    async function startDiscountCredit() {
        const user = await User("cliente-admin").findById(bizId);

        if (!user)
            return res.status(404).json({
                error: "No momento, esta empresa não está disponível.",
            });

        const gotFreeCredits = checkIfGotFreeCredits({ user, service });
        const gotServiceCredits = checkIfServiceGotCredit({ user, service });

        const { bizName, bizPlan } = user.clientAdminData;
        if (!gotFreeCredits) {
            return res.status(401).json(msg("error.registersLimit", bizName));
        }

        if (bizPlan !== "gratis" && !gotServiceCredits) {
            return res
                .status(401)
                .json({
                    error:
                        "Limite máximo de cadastro alcançado. Adicione mais créditos.",
                });
        }

        let newBalance; // for console.log only.
        const needFreeDiscount = gotFreeCredits === true;
        const {
            bizFreeCredits,
            totalClientUsers,
            bizPlanList,
            totalClientMembers,
        } = user.clientAdminData;

        const targetTotal = isCliUser
            ? "totalClientUsers"
            : "totalClientMembers";
        if (needFreeDiscount) {
            const thisNewBalance = bizFreeCredits[service] - 1;
            newBalance = thisNewBalance;

            bizFreeCredits[service] = thisNewBalance < 0 ? 0 : thisNewBalance;
            user.clientAdminData[targetTotal] += 1; // iin case of deletion, the substraction happens in the modalYesNo with method countFied
            user.markModified("clientAdminData.bizFreeCredits");
        } else {
            if (bizPlanList && !bizPlanList.length) return next();

            // discount and get discountedList
            const { list: discountedList, balance } = getDiscountedList({
                bizPlanList,
                service,
            });
            newBalance = lance;

            user.clientAdminData.bizPlanList = discountedList;
            // modifying an array requires we need to manual tell the mongoose the it is modified. reference: https://stackoverflow.com/questions/42302720/replace-object-in-array-in-mongoose
            user.clientAdminData[targetTotal] += 1;
            user.markModified("clientAdminData.bizPlanList");
        }

        await user.save();

        const succMsg = `It was discounted 1 ${
            needFreeDiscount ? "FREE CREDIT" : "credit"
        } from service ${service}. New balance is ${newBalance}`;
        console.log(succMsg);

        // handle first member app as free only
        const isFreeApp = totalClientMembers === 0 || !totalClientMembers;
        req.isFreeMemberApp = isFreeApp;

        next();
    }

    startDiscountCredit();
};

// GET - goal is to change welcome message to direct pay after first transaction.
exports.getProData = async (req, res) => {
    const { userId, nextExpiryDate } = req.query;

    User("cliente-admin")
        .findById(userId)
        .select(
            "clientAdminData.bizFreeCredits clientAdminData.orders clientAdminData.bizPlanList"
        )
        .exec((err, data) => {
            if (err || !data)
                return res.status(404).json({ error: "something went wrong" });
            const orders = data.clientAdminData.orders;
            const bizPlanList = data.clientAdminData.bizPlanList;
            const bizFreeCredits = data.clientAdminData.bizFreeCredits;

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

            const plan = !isPro ? "gratis" : getCurrPlan(orders);

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
                bizFreeCredits,
                bizPlanList,
            });
        });
};

exports.getNextExpiryDate = (req, res) => {
    const { userId } = req.query;

    User("cliente-admin")
        .findById(userId)
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

    User("cliente-admin")
        .findById(userId)
        .exec((err, user) => {
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
