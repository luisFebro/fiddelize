import useData from "init";
import { useReadUser } from "api/frequent";
import usePro from "init/pro";
import InstructionBtn from "components/buttons/InstructionBtn";
import showToast from "components/toasts";
import ActiveItemsTable from "./active-items-table/ActiveItemsTable";
import ActivePlanRenewal from "./active-plan-renewal/ActivePlanRenewal";

export default function ActiveItemsContent() {
    const { userId } = useData();

    const dataPro = usePro();
    const { plan, period } = dataPro;
    const { data, loading } = useReadUser(
        userId,
        "cliente-admin",
        "clientAdminData.bizPlanList clientAdminData.bizPlanData.mainItemList clientAdminData.bizPlanData.mainRef"
    );

    const mainRef = data && data.clientAdminData.bizPlanData.mainRef;
    const { mainItemList, tableItemList, planList } = treatLists(data, loading);

    const showTitle = () => (
        <div className="mt-5 text-purple">
            <h1 className="text-subtitle text-center font-weight-bold">
                Serviços Ativos do Plano
            </h1>
            <h2
                className="text-normal text-center"
                style={{
                    lineHeight: "25px",
                }}
            >
                Saiba sobre seus <strong>créditos e renovação</strong> do seu
                plano atual
            </h2>
        </div>
    );

    return (
        <section className="mb-5 text-normal text-purple">
            {showTitle()}
            <ActiveItemsTable loading={loading} planList={planList} />
            <ActivePlanRenewal
                loading={loading}
                mainItemList={mainItemList}
                mainRef={mainRef}
                tableItemList={tableItemList}
                planBr={plan}
                periodBr={period}
                dataPro={dataPro}
            />
        </section>
    );
}

// HELPERS
function treatLists(data, loading) {
    const bizPlanList =
        data && !loading ? data.clientAdminData.bizPlanList : [];
    const mainItemList =
        data && !loading ? data.clientAdminData.bizPlanData.mainItemList : [];

    // it should be two lists since the active services can not be the same as the main plan list
    const tableItemList = [];
    const planList = [];

    const getDefaultData = (i, currCredits, invAmount, invCredits) => ({
        service: i.name || i.service,
        currCredits,
        invCredits,
        invAmount,
        creditTypeBr: handleCreditTypeBr(i.creditType),
        creditTypeBrTooltip: (
            <div
                className="position-relative"
                onClick={() =>
                    showToast(getTooltipTxt(i.creditType), { dur: 10000 })
                }
                style={{
                    zIndex: 10000,
                }}
            >
                {handleCreditTypeBr(i.creditType)}
                <br />
                {showCreditTypeTooltip()}
            </div>
        ),
        expirable: i.expirable ? "sim" : "não",
    });

    mainItemList.forEach((i) => {
        const planItem = bizPlanList.find((item) => item.service === i.name);
        const currCredits = planItem && planItem.creditEnd;

        // if unique doesn't require buy more credits or doesn't expire. It was an uniqe purchase and is written off from the plan
        if (i.creditType === "unique") return null;

        return tableItemList.push(
            getDefaultData(i, currCredits, i.amount, i.count)
        );
    });

    bizPlanList.forEach((i) => {
        const planItem = mainItemList.find((item) => item.name === i.service);
        const invAmount = planItem && planItem.amount;
        const invCredits = planItem && planItem.count;

        const creditEnd = i.creditEnd || "ilimitado"; // Infinity as JSON is null
        return planList.push(
            getDefaultData(i, creditEnd, invAmount, invCredits)
        );
    });

    return {
        mainItemList,
        tableItemList,
        planList,
    };
}

function handleCreditTypeBr(creditType) {
    if (creditType === "unique") return "único";
    if (creditType === "accumulative") return "acumulativo";
    return "fixo";
}

// Tooltip not workng inside MuSelectTable
function showCreditTypeTooltip() {
    return (
        <span className="d-inline-block position-relative">
            <InstructionBtn
                text={null}
                mode="tooltip"
                tooltipProps={{ disabled: true }}
            />
        </span>
    );
}

/*
// - accumulated e.g Novvos Clientes / SMS - it is credits based and count is always accumulable with every new item.
// - fixed e.g Connecta Membros (the only service of this type) - it is credits based, but the count is not accumulable. it is expirable and its usage is fixed to a certain quantity. It only changes the quantity if the new current item is different from the prior recorded. Otherwise it will remain the same.
// - unique e.g a pro feature in the app - it is only one credit, it requires one purchase, the usage is forever and doesn't require purchase more credits
 */
function getTooltipTxt(creditType) {
    if (creditType === "accumulative")
        return `Crédito tipo ACUMULATIVO acumula sempre os créditos a cada renovação. Exemplo serviços: Novvos Clientes e SMS`;

    if (creditType === "fixed")
        return "Crédito tipo FIXO não acumula ao renovar e é sempre mesmo. O valor só muda quando for investido em um serviço com outro valor fixo";

    if (creditType === "unique")
        return "Crédito tipo ÚNICO é para serviços que você investe apenas uma vez e usa sem limites.";

    return "";
}
// HELPERS

/*
Na Fiddelize, seus{" "}
<strong>créditos não usados acumulam ao renovar</strong> seu
plano dentro do período de duração e você ganha mais tempo para
usar.
 */
