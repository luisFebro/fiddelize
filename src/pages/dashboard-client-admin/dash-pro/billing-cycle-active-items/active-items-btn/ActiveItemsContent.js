import useData from "init";
import { useReadUser } from "api/frequent";
import { formatDate } from "utils/dates/dateFns";
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
        "clientAdminData.bizPlanList clientAdminData.bizPlanData.mainItemList"
    );

    const mainItemList =
        data && !loading ? data.clientAdminData.bizPlanData.mainItemList : [];
    const itemList = treatItemList(data, loading);

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
                Na Fiddelize, seus{" "}
                <strong>créditos não usados acumulam ao renovar</strong> seu
                plano dentro do período de duração e você ganha mais tempo para
                usar.
            </h2>
        </div>
    );

    const showExpirationInfo = () => (
        <section
            className="position-relative text-normal text-center line-height-30"
            style={{
                top: -25,
            }}
        >
            Seu plano{" "}
            <strong className="text-pill">
                {plan && plan.cap()} {period}
            </strong>
            <br />
            termina em <strong>{handleExpiringDate(dataPro)}</strong>
        </section>
    );

    return (
        <section className="mb-5 text-normal text-purple">
            {showTitle()}
            <ActiveItemsTable loading={loading} itemList={itemList} />
            {showExpirationInfo()}
            <ActivePlanRenewal
                loading={loading}
                mainItemList={mainItemList}
                itemList={itemList}
                planBr={plan}
                periodBr={period}
            />
        </section>
    );
}

// HELPERS
function treatItemList(data, loading) {
    const bizPlanList =
        data && !loading ? data.clientAdminData.bizPlanList : [];
    const mainItemList =
        data && !loading ? data.clientAdminData.bizPlanData.mainItemList : [];

    const finalList = [];
    mainItemList.forEach((i) => {
        const planItem = bizPlanList.find((item) => item.service === i.name);
        const currCredits = planItem && planItem.creditEnd;

        return finalList.push({
            service: i.name,
            currCredits,
            invCredits: i.count,
            invAmount: i.amount,
        });
    });

    return finalList;
}

// the clients are pro when using this comp, no need isPro to verify
function handleExpiringDate(dataPro) {
    const { daysLeft, finishDate } = dataPro;

    const needCountDown = daysLeft <= 15;
    if (needCountDown) return `${daysLeft} dias`;

    const needYear = daysLeft >= 300;
    const fullFinishDate = formatDate(
        finishDate,
        `dd' 'MMM${needYear ? "', 'yyyy" : ""}`
    );

    return fullFinishDate && fullFinishDate.cap();
}
// HELPERS
