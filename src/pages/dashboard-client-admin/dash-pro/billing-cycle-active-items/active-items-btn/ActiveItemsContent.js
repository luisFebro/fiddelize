import useData from "init";
import { useReadUser } from "api/frequent";
import usePro from "init/pro";
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
        expirable: i.expirable ? "sim" : "não",
    });

    mainItemList.forEach((i) => {
        const planItem = bizPlanList.find((item) => item.service === i.name);
        const currCredits = planItem && planItem.creditEnd;

        return tableItemList.push(
            getDefaultData(i, currCredits, i.amount, i.count)
        );
    });

    bizPlanList.forEach((i) => {
        const planItem = mainItemList.find((item) => item.name === i.service);
        const invAmount = planItem && planItem.amount;
        const invCredits = planItem && planItem.count;

        return planList.push(
            getDefaultData(i, i.creditEnd, invAmount, invCredits)
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
// HELPERS

/*
Na Fiddelize, seus{" "}
<strong>créditos não usados acumulam ao renovar</strong> seu
plano dentro do período de duração e você ganha mais tempo para
usar.
 */
