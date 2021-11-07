import { getMaxCredit } from "utils/biz/pricing";
import convertToReal from "utils/numbers/convertToReal";
import { useState, useEffect, Fragment } from "react";
import MuSelectTable from "components/tables/MuSelectTable";
import showToast from "components/toasts";
import { getVars } from "init/var";
// import NotesSwitcher from "components/buttons/NotesSwitcher";

const headCells = [
    { id: "quantity", numeric: false, disablePadding: false, label: "Qtde." },
    { id: "service", numeric: false, disablePadding: false, label: "Serviço" },
    {
        id: "finalValue",
        numeric: false,
        disablePadding: false,
        label: "Valor final",
    },
];

export default function OrdersTableContent({
    listData,
    deleteBtns = false,
    loading,
    planBr,
    period,
    setData,
    // orders,
}) {
    const [list, setList] = useState([]);

    useEffect(() => {
        const customizedHtmlList = getOrderTableList(listData, {
            period,
            plan: planBr,
        });

        setList(customizedHtmlList);
    }, [listData, period, planBr]);

    const handleDeleteItem = (deleteInd, options = {}) => {
        const { recoverList, restoreAll = false } = options;
        if (restoreAll) {
            getVars([
                "pendingOrderItemList",
                "pendingOrderItemsCount",
                "pendingOrderInvestAmount",
            ]).then(
                ([
                    pendingOrderItemList,
                    pendingOrderItemsCount,
                    pendingOrderInvestAmount,
                ]) => {
                    setData((priorMainData) => ({
                        ...priorMainData,
                        itemList: pendingOrderItemList,
                        itemsCount: pendingOrderItemsCount,
                        investAmount: pendingOrderInvestAmount,
                    }));
                    setList(recoverList);
                }
            );
            return null;
        }

        return setList((priorList) => {
            const isOnlyOneItem = priorList && priorList.length === 1;
            if (isOnlyOneItem) {
                showToast("Pelo menos 1 item deve está na lista de pedido.", {
                    type: "error",
                });
                return priorList;
            }

            const deleteServiceDesc = list[deleteInd].service.props.children;
            const isForbiddenItem =
                planBr !== "bronze" &&
                deleteServiceDesc &&
                deleteServiceDesc.includes("Novvos Clientes");
            if (isForbiddenItem) {
                showToast(
                    "O serviço Novvos Clientes só pode ser removido no plano Bronze.",
                    { type: "error" }
                );
                return priorList;
            }

            setData((priorMainData) => {
                const newMainList = priorMainData.itemList.filter(
                    (x, ind) => ind !== deleteInd
                );
                const investAmount = newMainList.reduce(
                    (acc, next) => Number(acc) + Number(next.amount),
                    0
                );

                return {
                    ...priorMainData,
                    itemList: newMainList,
                    itemsCount: newMainList.length,
                    investAmount,
                };
            });

            return priorList.filter((x, ind) => ind !== deleteInd);
        });
    };

    return (
        <Fragment>
            <MuSelectTable
                headCells={headCells}
                rowsData={list}
                loading={loading}
                needMainTitle={false}
                needHighlightColor={false}
                marginBottom=" "
                enumeration=" "
                deleteBtns={deleteBtns}
                callbackDeleteBtns={deleteBtns ? handleDeleteItem : null}
            />
        </Fragment>
    );
}

// TABLE HTML CONTENT
function getOrderTableList(orderList = [], options = {}) {
    const { plan, period } = options;

    // Handle object into object and return custom data for table:
    // const thisModel = { currPlan: {count: 4, amount: 350}}

    const handleServiceName = ({ type, serv, plan, period, count }) => {
        const plural = count > 1 ? "s" : "";

        if (type === "fullPlan")
            return `Plano ${plan || "pro"} ${handlePeriod({
                plan,
                period,
            })}${handleDesc({ plan, serv, period })}`;

        if (serv === "sms")
            return `${convertToReal(
                count
            )} créditos de SMS - sem prazo de expiração`;

        if (serv === "Novvos Clientes")
            return `Novvos Clientes com +${convertToReal(
                count
            )} cadastro${plural} de cliente${plural}`;

        if (serv === "Novvos Membros")
            return `Novvos Membros com +${count} cadastro${plural} de membro${plural}`;

        return serv;
    };

    const getElem = (elem) => (
        <span
            className="d-flex justify-content-center"
            style={{ fontSize: 20 }}
        >
            {elem}
        </span>
    );

    const newList = orderList.map((item) => {
        const { type, count, name } = item;
        let { amount } = item;
        amount = convertToReal(amount, {
            moneySign: true,
            needFraction: true,
        });

        const serviceElem = (
            <span className="d-inline-block" style={{ width: 250 }}>
                {handleServiceName({
                    type,
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

    return newList || [];
}

// HELPERS
function handleDesc({ plan, serv, period }) {
    const isCliCredits = serv === "Novvos Clientes";
    if (plan === "ouro")
        return ` com cadastro ilimitado de ${
            isCliCredits ? "clientes" : "membros"
        }`;

    const maxCliCredits = convertToReal(
        getMaxCredit(period).silver["Novvos Clientes"]
    );
    const maxMemberCredits = convertToReal(
        getMaxCredit(period).silver["Novvos Membros"]
    );
    if (plan === "prata")
        return ` com cadastro de até ${
            isCliCredits
                ? `${maxCliCredits} clientes`
                : `${maxMemberCredits} membros`
        }`;

    return "";
}

function handlePeriod({ plan, period }) {
    if (period === "yearly") return "anual";
    if (!plan) return "";
    return "mensal";
}
// END HELPERS
// END TABLE HTML CONTENT

/* ARCHIVES
Some of these notes can be written in some Q&A
const notes = (
    <Fragment>
        - Os pacotes de SMS não tem validade, não expiram.
        <br />
        <br />- Você dá acesso sem restrição aos seus clientes que{" "}
        <strong>já foram cadastrados</strong>. Eles continuam usando o app
        mesmo quando o prazo de seu plano terminar. Você precisa renovar seu
        plano para novos clintes.
        <br />
        <br />
        <br />- Os créditos disponíveis em cada serviço{" "}
        <strong>são acumulativos apenas durante o tempo de uso</strong>.
        Assim, quando um plano é renovado antes de expirar, você não perde
        os créditos não usados e ganha um novo tempo de uso.
        <br />
        <br /> - Porém, quando o tempo de uso termina ou expira, todos os
        créditos restantes <strong>são zerados automaticamente</strong> de
        forma permanente.
        <br />
        <br /> - Você é notificado <strong>5 dias</strong> antes de expirar
        algum plano ou serviço.
        <br />
        <br />- Você consegue renovar um plano mensal para anual ou
        vice-versa quantas vezes precisar.
        <br />
        <br />- Você pode fazer investimentos em{" "}
        <strong>diferentes planos</strong> tanto mensais ou anuais. Cada
        transação de plano possui seu próprio tempo de uso que você
        acompanha no seu histórico de investimentos.
    </Fragment>
);

<NotesSwitcher
    color={
        notesColor === "white" ? "text-white" : "text-purple"
    }
    btnStyle={{ top: -35, right: -80 }}
    btnSize="small"
    notes={notes}
    rootClassName={notesColor === "purple" ? "mx-3" : undefined}
    shadowTitle={
        notesColor === "white" ? "text-shadow" : undefined
    }
/>

 */

/*

<br />
<br />- O seu maior plano investido é o que será identificado como
atual. Você pode investir no <strong>plano ouro</strong>, por
exemplo, e a qualquer momento investir no{" "}
<strong>plano bronze</strong> que ainda continuará no plano ouro. Se
o seu plano for bronze e atualizar para planos maiores, daí sim você
muda de plano atual.

 */
