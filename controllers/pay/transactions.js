const User = require("../../models/user/User");
const Order = require("../../models/order/Order");
const axios = require("axios");
const { globalVar } = require("./globalVar");
const xml2js = require("xml2js");
const parser = new xml2js.Parser({ attrkey: "ATTR" });
const {
    getTransactionStatusTypes,
    getPaymentMethod,
} = require("./helpers/getTypes");
const { getNewPlanDays } = require("./helpers/getNewPlanDays");

const {
    getDataChunk,
    getChunksTotal,
} = require("../../utils/array/getDataChunk");
const addDays = require("date-fns/addDays");

const { payUrl, sandboxMode, email, token } = globalVar;

// real time notification to Fiddelize's system every time a transation's status change like pending to paid.
/*
Enquanto seu sistema não receber uma notificação, o PagSeguro irá envia-la novamente a cada 2 horas, até um máximo de 5 tentativas
Note que a notificação não possui nenhuma informação sobre a transação.
*/
const RELEASE_DATE_SPAN = 15; // 15 or 30 days on PagSeguro
const paymentReleaseDate = addDays(new Date(), RELEASE_DATE_SPAN);

const handlePlanDueDate = (currStatus, doc, reference, isCurrRenewal) => {
    const trigger =
        (currStatus === "pago" && !doc.planDueDate) ||
        (currStatus === "pago" && isCurrRenewal);
    return trigger
        ? addDays(new Date(), getNewPlanDays(reference))
        : doc.planDueDate;
};

// Enquanto seu sistema não receber uma notificação, o PagSeguro irá envia-la novamente a cada 2 horas, até um máximo de 5 tentativas. Se seu sistema ficou indisponível por um período maior que este e não recebeu nenhum dos envios da notificação, ainda assim é possível obter os dados de suas transações usando a Consulta de Transações.
const getPagNotify = (req, res) => {
    const notificationCode = req.body.notificationCode;

    // Consulting notification transaction - requiring auth data related to received notification's code.
    const params = {
        email,
        token,
    };

    const config = {
        method: "get",
        url: `${payUrl}/v3/transactions/notifications/${notificationCode}`,
        params,
        headers: {
            charset: "ISO-8859-1",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };

    axios(config)
        .then((response) => {
            const xml = response.data;
            parser.parseString(xml, function (error, result) {
                if (error === null) {
                    const data = result.transaction;

                    const [status] = data.status;
                    const [reference] = data.reference;
                    const [lastEventDate] = data.lastEventDate;
                    const [paymentMethod] = data.paymentMethod;
                    const [paymentMethodCode] = paymentMethod.code;

                    const mainRef = reference;

                    const currStatus = getTransactionStatusTypes(status);
                    let thisDueDate;
                    Order.findOne({ reference }).exec((err, doc) => {
                        if (err)
                            return res
                                .status(500)
                                .json(msgG("error.systemError", err));

                        const isCurrRenewal = doc && doc.isCurrRenewal;
                        thisDueDate = handlePlanDueDate(
                            currStatus,
                            doc,
                            reference,
                            isCurrRenewal
                        );
                        doc.planDueDate = thisDueDate; // I already modified future date on checkout for renewal.
                        doc.paymentMethod = getPaymentMethod(paymentMethodCode);
                        doc.updatedAt = lastEventDate;
                        doc.transactionStatus = getTransactionStatusTypes(
                            status
                        );
                        const payRelease = doc.paymentReleaseDate;
                        doc.paymentReleaseDate = payRelease
                            ? payRelease
                            : paymentReleaseDate;

                        // modifying an array requires we need to manual tell the mongoose the it is modified. reference: https://stackoverflow.com/questions/42302720/replace-object-in-array-in-mongoose
                        // doc.markModified("clientAdminData");
                        const clientAdminId = doc.clientAdmin.id;
                        doc.save((err) => {
                            User.findOne({ _id: clientAdminId })
                                .select("clientAdminData.orders")
                                .exec((err, data2) => {
                                    let orders = data2.clientAdminData.orders;

                                    const modifiedOrders = orders.map(
                                        (targetOr) => {
                                            const priorRef =
                                                targetOr.renewal &&
                                                targetOr.renewal.priorRef;
                                            const condition = isCurrRenewal
                                                ? targetOr.reference ===
                                                      mainRef ||
                                                  targetOr.reference ===
                                                      priorRef
                                                : targetOr.reference ===
                                                  mainRef;
                                            if (condition) {
                                                if (currStatus === "pago") {
                                                    const {
                                                        renewal,
                                                    } = targetOr;
                                                    if (
                                                        mainRef ===
                                                        (renewal &&
                                                            renewal.currRef)
                                                    ) {
                                                        targetOr.renewal.isPaid = true;
                                                    }
                                                }

                                                targetOr.planDueDate = thisDueDate;
                                                targetOr.paymentMethod = getPaymentMethod(
                                                    paymentMethodCode
                                                );
                                                targetOr.transactionStatus = currStatus;
                                                // targetOr.renewalHistory.transitionStatus
                                                targetOr.updatedAt = lastEventDate;

                                                return targetOr;
                                            }

                                            return targetOr;
                                        }
                                    );
                                    data2.clientAdminData.orders = modifiedOrders;
                                    // modifying an array requires we need to manual tell the mongoose the it is modified. reference: https://stackoverflow.com/questions/42302720/replace-object-in-array-in-mongoose
                                    // orders.markModified("clientAdminData.orders");
                                    data2.save((err) => {
                                        res.json({
                                            msg:
                                                "both agent and cliAdmin updated on db",
                                        });
                                    });
                                });
                        });
                    });
                } else {
                    console.log(error);
                }
            });
        })
        .catch((e) => res.json(e.response.data));
};

const readHistory = (req, res) => {
    const { userId, skip, limit = 10 } = req.query;

    User.findById(userId)
        .select("clientAdminData.orders")
        .exec((err, user) => {
            if (err || !user)
                return res.status(400).json({ error: "Orders not found" });

            const data = user.clientAdminData.orders;

            const dataSize = data.length;
            const dataRes = {
                list: getDataChunk(data, { skip, limit }),
                chunksTotal: getChunksTotal(dataSize, limit),
                listTotal: dataSize,
                content: undefined,
            };

            res.json(dataRes);
        });
};

// Estornar transação.
const refundTransaction = (req, res) => {
    const { transactionCode } = req.body;

    const params = {
        email,
        token,
    };

    const body = {
        transactionCode, // Transação deverá estar com os status Paga, Disponível ou Em disputa.  Formato: Uma sequência de 36 caracteres, com os hífens, ou 32 caracteres, sem os hífens.
        refundValue, // STRING Utilizado no estorno de uma transação, corresponde ao valor a ser devolvido. Se não for informado, o PagSeguro assume que o valor a ser estornado é o valor total da transação
    };

    const config = {
        method: "post",
        url: `${payUrl}/v2/transactions/refunds`,
        data: body,
        params,
        headers: {
            "Accept-Charset": "ISO-8859-1",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };
};

const cancelTransaction = (req, res) => {
    const { transactionCode } = req.body;

    const params = {
        email,
        token,
    };

    const body = {
        transactionCode, // Transação deverá estar com os status Aguardando pagamento ou Em análise
    };

    const config = {
        method: "post",
        url: `${payUrl}/v2/transactions/cancels`,
        data: body,
        params,
        headers: {
            "Accept-Charset": "ISO-8859-1",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };
};

module.exports = {
    getPagNotify,
    readHistory,
    refundTransaction,
    cancelTransaction,
};

/* ARCHIVES
GET
it is no longer needed because pagseguroro reads every transaction ans send notification about them in every transaction change
const readTransaction = (req, res) => {
    const { transactionCode } = req.query;

    const params = {
        email,
        token,
    };

    const config = {
        method: "get",
        url: `${payUrl}/v2/transactions/${transactionCode}`,
        params,
        headers: {
            "Accept-Charset": "ISO-8859-1",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };

    axios(config)
        .then((response) => {
            const xml = response.data;
            parser.parseString(xml, function (error, result) {
                if (error === null) {
                    const data = result.transaction;

                    const [status] = data.status;
                    const [lastEventDate] = data.lastEventDate;
                    const [paymentMethod] = data.paymentMethod;
                    const [paymentMethodCode] = paymentMethod.code;

                    res.json({
                        status,
                        lastEventDate,
                        paymentMethodCode,
                    });
                } else {
                    console.log(error);
                }
            });
        })
        .catch((e) => res.json(e.response.data));
};

GET
it is depracated because i already have history stored on db
const readHistory = (req, res) => {
    const {
        reference,
        initialDate,
        finalDate,
        page = 1,
        maxPageResults = 10,
    } = req.query;

    const params = {
        email,
        token,
        reference, // * Código de referência da transação. Código informado na criação da transação para fazer referência ao pagamento.
        initialDate, // Obrigatório:** Se estiver utilizando o finalDate Especifica a data inicial do intervalo de pesquisa. Somente transações criadas a partir desta data serão retornadas. Esta data não pode ser anterior a 6 meses da data corrente. Formato:YYYY-MM-DDThh:mm:ss.sTZD
        finalDate,
        page, // O número de resultados retornado pela consulta por código de referência pode ser grande, portanto é possível fazer a paginação dos resultados. A primeira página retornada é 1 e assim por diante. Este parâmetro especifica qual é a página de resultados a ser retornada.
        maxPageResults, //Número máximo de resultados por página. Para limitar o tamanho da resposta de cada chamada à consulta, é possível especificar um número máximo de resultados por página.
    };

    const config = {
        method: "post",
        url: `${payUrl}/v2/transactions`,
        data: body,
        params,
        headers: {
            "Accept-Charset": "ISO-8859-1",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };
};
*/
