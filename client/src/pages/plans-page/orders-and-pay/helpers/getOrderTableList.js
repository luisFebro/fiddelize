import React from "react";
import convertToReal from "../../../../utils/numbers/convertToReal";
// Handle object into object and return custom data for table:
// const thisModel = { currPlan: {amount: 4, price: 350}}

const handleServiceName = ({
    serv,
    plan,
    period,
    amount,
    totalPackage,
    packageQtt,
}) => {
    if (serv === "currPlan")
        return `Plano ${plan ? plan : "profissional"} ${
            period === "yearly" ? "anual" : "mensal"
        } com ${amount} serviços`;

    if (serv === "sms")
        return `${totalPackage} ${
            totalPackage === 1 ? "pacote" : "pacotes"
        } com ${convertToReal(packageQtt)} SMS`;

    if (serv === "customers")
        return `Novvos Clientes - ${totalPackage} ${
            totalPackage === 1 ? "pacote" : "pacotes"
        } com ${convertToReal(packageQtt)} clientes`;

    return serv;
};

const getElem = (elem) => (
    <span className="d-flex justify-content-center" style={{ fontSize: 20 }}>
        {elem}
    </span>
);

export default function getOrderTableList(orders, options = {}) {
    const { plan, period } = options;

    const newList = [];
    let thisTotalServ = 0;

    for (let serv in orders) {
        let { amount, price, totalPackage, isPreSale } = orders[serv];
        price = convertToReal(price, {
            moneySign: true,
            needFraction: true,
        });

        let packageQtt;
        if (totalPackage) {
            packageQtt = amount;
            amount = 1;
        }

        thisTotalServ += amount;

        const serviceElem = (
            <span className="d-inline-block" style={{ width: 250 }}>
                {handleServiceName({
                    serv,
                    plan,
                    period,
                    amount,
                    totalPackage,
                    packageQtt,
                })}
                {isPreSale && (
                    <span className="d-inline-block ml-2 text-pill theme-back-blue">
                        pré-venda
                    </span>
                )}
            </span>
        );

        const orderItem = {
            quantity: getElem(amount),
            service: serviceElem,
            finalValue: getElem(price),
        };
        newList.push(orderItem);
    }

    return { newList, thisTotalServ };
}
