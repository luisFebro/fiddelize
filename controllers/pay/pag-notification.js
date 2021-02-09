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
const {
    getTransactionStatusTypes,
    getPaymentMethodType,
} = require("./helpers/getTypes");
const { sendBackendNotification } = require("../notification/notification");
const handlePaymentDetails = require("./helpers/handlePaymentDetails");
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
        res.status(400).json(
            `${e.response.data}. IMPORTANT: sandbox should be on production for testing...`
        );
    });
    if (!response) return;
    const xml = response.data;

    const result = await convertXmlToJson(xml);

    const data = result.transaction;

    const [status] = data.status;
    const [reference] = data.reference;
    const [lastEventDate] = data.lastEventDate;
    // Payment method
    const [paymentMethodNum] = data.paymentMethod[0].type;
    const currPayMethod = getPaymentMethodType(paymentMethodNum);
    // const isCreditCard = paymentMethodNum === "1";
    // const isBoleto = paymentMethodNum === "2";
    // const isBankDebit = paymentMethodNum === "3";
    // End Payment method

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
    doc.paymentDetails = handlePaymentDetails({
        currPayMethod,
        currDetails: doc.paymentDetails,
        escrow: data.escrowEndDate,
        creditorFees: data.creditorFees[0],
    });

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
    console.log("orders", JSON.stringify(orders));
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

/* RESPONSE EXAMPLES
CREDIT CARD - Cartão de crédito (pagamento em 12x)
{
    "date": [
        "2021-01-02T12:50:22.000-03:00"
    ],
    "code": [
        "028496E3-EB96-4484-99CC-0785E0935CE7"
    ],
    "reference": [
        "PR-Q4-A-6KH25KN"
    ],
    "type": [
        "1"
    ],
    "status": [
        "3"
    ],
    "lastEventDate": [
        "2021-01-02T13:33:10.000-03:00"
    ],
    "paymentMethod": [
        {
            "type": [
                "1"
            ],
            "code": [
                "101"
            ]
        }
    ],
    "grossAmount": [
        "338.00"
    ],
    "discountAmount": [
        "0.00"
    ],
    "creditorFees": [
        {
            "installmentFeeAmount": [
                "0.00"
            ],
            "intermediationRateAmount": [
                "0.40"
            ],
            "intermediationFeeAmount": [
                "16.87"
            ]
        }
    ],
    "netAmount": [
        "320.73"
    ],
    "extraAmount": [
        "0.00"
    ],
    "escrowEndDate": [ // ˈeskrō (Fim data de garantia) - a bond, deed, or other document kept in the custody of a third party and taking effect only when a specified condition has been fulfilled.
        "2021-01-16T13:33:10.000-03:00"
    ],
    "installmentCount": [
        "12"
    ],
    "itemCount": [
        "1"
    ],
    "items": [
        {
            "item": [
                {
                    "id": [
                        "123"
                    ],
                    "description": [
                        "Plano bronze anual com  servico no valor total de: R$ 338.00"
                    ],
                    "quantity": [
                        "1"
                    ],
                    "amount": [
                        "338.00"
                    ]
                }
            ]
        }
    ],
    "sender": [
        {
            "name": [
                "Febro Feitoza"
            ],
            "email": [
                "teste@sandbox.pagseguro.com.br"
            ],
            "phone": [
                {
                    "areaCode": [
                        "92"
                    ],
                    "number": [
                        "992576121"
                    ]
                }
            ],
            "documents": [
                {
                    "document": [
                        {
                            "type": [
                                "CPF"
                            ],
                            "value": [
                                "43171124262"
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    "gatewaySystem": [
        {
            "type": [
                "cielo"
            ],
            "rawCode": [
                {
                    "ATTR": {
                        "xsi:nil": "true",
                        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
                    }
                }
            ],
            "rawMessage": [
                {
                    "ATTR": {
                        "xsi:nil": "true",
                        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
                    }
                }
            ],
            "normalizedCode": [
                {
                    "ATTR": {
                        "xsi:nil": "true",
                        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
                    }
                }
            ],
            "normalizedMessage": [
                {
                    "ATTR": {
                        "xsi:nil": "true",
                        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
                    }
                }
            ],
            "authorizationCode": [
                "0"
            ],
            "nsu": [
                "0"
            ],
            "tid": [
                "0"
            ],
            "establishmentCode": [
                "1056784170"
            ],
            "acquirerName": [
                "CIELO"
            ]
        }
    ],
    "primaryReceiver": [
        {
            "publicKey": [
                "PUB47BC2049F30544A5A0F252FD0BF11672"
            ]
        }
    ]
}

BANK DEBIT - Débito online (pagamento em 1x)
{
    "date": [
        "2021-01-02T05:14:09.000-03:00"
    ],
    "code": [
        "1FAFB7AB-1639-4283-AA09-FE99B12A8DCF"
    ],
    "reference": [
        "-Q1--V8YJ4D0"
    ],
    "recoveryCode": [
        "7df5a68dd88c50bb3edcb5077f726932813306a6f0a154ac"
    ],
    "type": [
        "1"
    ],
    "status": [
        "1"
    ],
    "lastEventDate": [
        "2021-01-02T05:14:09.000-03:00"
    ],
    "paymentMethod": [
        {
            "type": [
                "3"
            ],
            "code": [
                "301"
            ]
        }
    ],
    "paymentLink": [
        "https://sandbox.pagseguro.uol.com.br/checkout/payment/eft/print.jhtml?c=031e850192db26452d0762aafd80a92ae8e7b6e891600828fd659e137b7b4c20dfc62d6230b4987d"
    ],
    "grossAmount": [
        "62.00"
    ],
    "discountAmount": [
        "0.00"
    ],
    "creditorFees": [
        {
            "intermediationRateAmount": [
                "0.40"
            ],
            "intermediationFeeAmount": [
                "3.09"
            ]
        }
    ],
    "netAmount": [
        "58.51"
    ],
    "extraAmount": [
        "0.00"
    ],
    "installmentCount": [
        "1"
    ],
    "itemCount": [
        "1"
    ],
    "items": [
        {
            "item": [
                {
                    "id": [
                        "123"
                    ],
                    "description": [
                        "Plano pro  com  servico no valor total de: R$ 62.00"
                    ],
                    "quantity": [
                        "1"
                    ],
                    "amount": [
                        "62.00"
                    ]
                }
            ]
        }
    ],
    "sender": [
        {
            "name": [
                "Febro Feitoza"
            ],
            "email": [
                "teste@sandbox.pagseguro.com.br"
            ],
            "phone": [
                {
                    "areaCode": [
                        "92"
                    ],
                    "number": [
                        "992576121"
                    ]
                }
            ],
            "documents": [
                {
                    "document": [
                        {
                            "type": [
                                "CPF"
                            ],
                            "value": [
                                "43171124262"
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    "primaryReceiver": [
        {
            "publicKey": [
                "PUB47BC2049F30544A5A0F252FD0BF11672"
            ]
        }
    ]
}

BOLETO
{
    "date": [
        "2021-01-02T19:06:04.000-03:00"
    ],
    "code": [
        "2A319101-D9C5-4C09-95F5-BB7F17C6F172"
    ],
    "reference": [
        "BR-Q1-A-KKB0H0Z"
    ],
    "type": [
        "1"
    ],
    "status": [
        "1"
    ],
    "lastEventDate": [
        "2021-01-02T19:06:08.000-03:00"
    ],
    "paymentMethod": [
        {
            "type": [
                "2"
            ],
            "code": [
                "202"
            ]
        }
    ],
    "paymentLink": [
        "https://sandbox.pagseguro.uol.com.br/checkout/payment/booklet/print.jhtml?c=348ff314947a8117712e8df1da6f78a055156a72528bdd790345e529768e1e9c5d8ede577944f937"
    ],
    "grossAmount": [
        "299.00"
    ],
    "discountAmount": [
        "0.00"
    ],
    "creditorFees": [
        {
            "intermediationRateAmount": [
                "0.40"
            ],
            "intermediationFeeAmount": [
                "14.92"
            ]
        }
    ],
    "netAmount": [
        "283.68"
    ],
    "extraAmount": [
        "-1.00"
    ],
    "installmentCount": [
        "1"
    ],
    "itemCount": [
        "1"
    ],
    "items": [
        {
            "item": [
                {
                    "id": [
                        "123"
                    ],
                    "description": [
                        "Plano bronze anual com  servico no valor total de: R$ 300.00"
                    ],
                    "quantity": [
                        "1"
                    ],
                    "amount": [
                        "300.00"
                    ]
                }
            ]
        }
    ],
    "sender": [
        {
            "name": [
                "Febro Feitoza"
            ],
            "email": [
                "teste.fiddelize@sandbox.pagseguro.com.br"
            ],
            "phone": [
                {
                    "areaCode": [
                        "92"
                    ],
                    "number": [
                        "992576121"
                    ]
                }
            ],
            "documents": [
                {
                    "document": [
                        {
                            "type": [
                                "CPF"
                            ],
                            "value": [
                                "31968323414"
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    "primaryReceiver": [
        {
            "publicKey": [
                "PUB47BC2049F30544A5A0F252FD0BF11672"
            ]
        }
    ]
}
 */
