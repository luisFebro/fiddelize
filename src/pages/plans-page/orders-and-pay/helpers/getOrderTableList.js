import convertToReal from "utils/numbers/convertToReal";
// Handle object into object and return custom data for table:
// const thisModel = { currPlan: {count: 4, amount: 350}}

const handleServiceName = ({ serv, plan, period, count }) => {
    const plural = count > 1 ? "s" : "";

    if (serv === "currPlan")
        return `Plano ${plan || "profissional"} ${handlePeriod({
            plan,
            period,
        })}${handleDesc({ plan })}`;

    if (serv === "sms")
        return `${convertToReal(count)} créditos de SMS - sem mensalidade`;

    if (serv === "Novvos Clientes")
        return `Novvos Clientes com +${convertToReal(
            count
        )} cadastro${plural} de cliente${plural}`;

    if (serv === "Novvos Membros")
        return `Novvos Membros com +${count} cadastro${plural} de membro${plural}`;

    return serv;
};

const getElem = (elem) => (
    <span className="d-flex justify-content-center" style={{ fontSize: 20 }}>
        {elem}
    </span>
);

export default function getOrderTableList(orderList, options = {}) {
    const { plan, period } = options;

    const newList = orderList.map((item) => {
        const { count, name } = item;
        let { amount } = item;
        amount = convertToReal(amount, {
            moneySign: true,
            needFraction: true,
        });

        const serviceElem = (
            <span className="d-inline-block" style={{ width: 250 }}>
                {handleServiceName({
                    serv: name,
                    plan,
                    period,
                    count,
                })}
            </span>
        );

        return {
            quantity: getElem(1),
            service: serviceElem,
            finalValue: getElem(amount),
        };
    });

    return {
        newList,
        thisTotalServ: orderList && orderList.length,
    };
}

// HELPERS
function handleDesc({ plan }) {
    if (plan === "ouro") return " com cadastro ilimitado de clientes e membros";
    if (plan === "prata")
        return " com cadastro de até 2.000 clientes e 10 membros";

    return "";
}

function handlePeriod({ plan, period }) {
    if (period === "yearly") return "anual";
    if (!plan) return "";
    return "mensal";
}
// END HELPERS
