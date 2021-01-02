const User = require("../../models/user/User");
const Order = require("../../models/order/Order");
const Pricing = require("../../models/admin/Pricing");
const axios = require("axios");
const qs = require("querystring");
const { payUrl, email, token } = require("./globalVar");
const convertXmlToJson = require("../../utils/promise/convertXmlToJson");
const addDays = require("date-fns/addDays");
const { getNewPlanDays } = require("./helpers/getNewPlanDays");
const {
    getDataChunk,
    getChunksTotal,
} = require("../../utils/array/getDataChunk");
const {
    handleProPlan,
    handleModifiedOrders,
    handleProSMSCredits,
} = require("./helpers/transactionHandlers");
const { getTransactionStatusTypes } = require("./helpers/getTypes");
const { sendBackendNotification } = require("../notification");
// real time notification to Fiddelize's system every time a transation's status change like pending to paid.
/*
Enquanto seu sistema não receber uma notificação, o PagSeguro irá envia-la novamente a cada 2 horas, até um máximo de 5 tentativas
Note que a notificação não possui nenhuma informação sobre a transação.
Só pode transferir apenas uma vez ao dia de forma gratuita.
*/
const RELEASE_DATE_SPAN = 15; // 15 or 30 days on PagSeguro
const paymentReleaseDate = addDays(new Date(), RELEASE_DATE_SPAN);

const getPaidStatus = (currStatus) => currStatus === "pago"; // || currStatus === "disponível" available can trigger twice a function...

const handlePlanDueDate = (
    currStatus,
    doc,
    reference,
    isCurrRenewal,
    isSingleRenewal,
    totalRenewalDays
) => {
    const trigger =
        !doc.planDueDate ||
        (getPaidStatus(currStatus) && !doc.planDueDate) ||
        (getPaidStatus(currStatus) && isCurrRenewal) ||
        (getPaidStatus(currStatus) && isSingleRenewal);

    const addedDays = totalRenewalDays
        ? totalRenewalDays // add days left and curr renewal days to the current date.
        : getNewPlanDays(reference); //  for new transactions. totalRenewalDays will be undefiend.
    return trigger ? addDays(new Date(), addedDays) : doc.planDueDate; // doc.planDueDate returns the same date if not paid, triggered.
};

// Enquanto seu sistema não receber uma notificação, o PagSeguro irá envia-la novamente a cada 2 horas, até um máximo de 5 tentativas. Se seu sistema ficou indisponível por um período maior que este e não recebeu nenhum dos envios da notificação, ainda assim é possível obter os dados de suas transações usando a Consulta de Transações.
// FUCKIN LESSON: Axios serializes JavaScript objects to JSON. To serialize in application/x-www-form-urlencoded format you will need to use one of the techniques described in the Axios documentation.https://github.com/axios/axios#using-applicationx-www-form-urlencoded-format
// FUCKIN LESSON 2: Changes in this code should be deployed since the payment operator will be running with the deployed version of the app.
async function getPagNotify(req, res) {
    const { notificationCode } = req.body;

    const params = {
        email,
        token,
    };

    // IMPORTANT LESSON: Do not mix sandMode with production!!! if using sandMode and request for production will return Request failed with status code 404 will appear on PROD if you are testing with SAND TEST MODE
    // You should force sandbox on globalVar to production in order to work for testing!!
    const config = {
        method: "get",
        url: `${payUrl}/v3/transactions/notifications/${notificationCode}`,
        params,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };

    const response = await axios(config).catch((e) => {
        res.json(e);
    });
    if (!response) return;
    const xml = response.data;

    const result = await convertXmlToJson(xml);

    const data = result.transaction;

    const [status] = data.status;
    const [reference] = data.reference;
    const [lastEventDate] = data.lastEventDate;
    // check this value...
    // const [paymentMethod] = data.paymentMethod;

    // const currPayMethod = "boleto";
    const currStatus = getTransactionStatusTypes(status);
    const isPaid = getPaidStatus(currStatus);

    let thisDueDate;

    const doc = await Order.findOne({ reference }).catch((e) => {
        res.status(404).json({ error: "order not found!" });
    });
    if (!doc) return;

    const { isCurrRenewal, isSingleRenewal, totalRenewalDays } = doc;

    thisDueDate = handlePlanDueDate(
        currStatus,
        doc,
        reference,
        isCurrRenewal,
        isSingleRenewal,
        totalRenewalDays
    );

    doc.planDueDate = thisDueDate;
    doc.updatedAt = lastEventDate;
    doc.transactionStatus = getTransactionStatusTypes(status);

    const payRelease = doc.paymentReleaseDate;
    doc.paymentReleaseDate = payRelease ? payRelease : paymentReleaseDate;

    const clientAdminId = doc.clientAdmin.id;

    // doc.markModified("clientAdminData");
    await doc.save();
    const allPricing = await Pricing.find({});
    if (!allPricing) return console.log("something went wrong with Pricing");

    const adminData = await User("cliente-admin").findOne({
        _id: clientAdminId,
    });

    let orders = adminData.clientAdminData.orders;
    let currBizPlanList = adminData.clientAdminData.bizPlanList;

    const modifiedOrders = orders.map((targetOr) => {
        return handleModifiedOrders({
            targetOr,
            isCurrRenewal,
            reference,
            isPaid,
            thisDueDate,
            currStatus,
            lastEventDate,
        });
    });

    if (isPaid) {
        const isSMS = orders.find(
            (o) =>
                o.reference === reference &&
                o.ordersStatement &&
                o.ordersStatement.sms
        );

        if (isSMS) {
            // This is an exception because SMS was built firstly and has a different reasoning to add credits
            adminData.clientAdminData.smsBalance = handleProSMSCredits({
                adminData,
                isSMS,
            });
        }

        handleProPlan({
            adminData,
            currBizPlanList,
            reference,
            orders: modifiedOrders,
            allPricing,
            thisDueDate,
        });

        const gotPaidServices = currBizPlanList && currBizPlanList.length;
        const notifData = {
            cardType: "pro",
            subtype: gotPaidServices ? "proPay" : "welcomeProPay",
            recipient: { role: "cliente-admin", id: clientAdminId },
            content: `approvalDate:${new Date()};`,
        };

        await sendBackendNotification({ notifData });
    }

    adminData.clientAdminData.orders = modifiedOrders;

    await adminData.save();

    res.json({
        msg: "both agent and cliAdmin updated on db",
    });
}

module.exports = getPagNotify;
