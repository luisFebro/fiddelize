const User = require("../../../../models/user/User");

async function setUserOrderInDB(data = {}) {
    const { isRenewal, userId } = data;
    if (!userId) return Promise.reject({ error: "missing mandatory params." });

    let dataCliAdmin = {
        reference: data.reference,
        investAmount: (Number(data.amount) + 1).toFixed(2).toString(), // I discounted R$1, then replacing again to displace the correct price to cliAdmin
        ordersStatement: data.ordersStatement, // e.g "{ 'Novvos Membros': { totalPackage: 10, amount: 0, price: 300 } }"
        paymentMethod: data.paymentMethod,
        renewal: data.renewal, // default: undefined
        // boleto
        paymentLink: data.paymentLink, // boleto or eft
        payDueDate: data.dueDate,
        barcode: data.barcode,
    };

    const doc = await User("cliente-admin")
        .findById(userId)
        .catch((e) => e);
    if (!doc) return;

    const orders = doc.clientAdminData.orders;

    if (isRenewal) {
        const modifiedOrders =
            orders &&
            orders.map((serv) => {
                if (serv.reference === (renewal && renewal.priorRef)) {
                    serv.renewal = {
                        ...renewal,
                        isOldCard: true,
                    };
                    return serv;
                }

                return serv;
            });

        doc.clientAdminData.orders = [dataCliAdmin, ...modifiedOrders];
    } else {
        doc.clientAdminData.orders = [dataCliAdmin, ...orders];
    }

    // modifying an array requires we need to manual tell the mongoose the it is modified. reference: https://stackoverflow.com/questions/42302720/replace-object-in-array-in-mongoose
    doc.markModified("clientAdminData.orders");
    await doc.save().catch((e) => e);

    return { msg: "orders set successfully!" };
}

module.exports = setUserOrderInDB;
