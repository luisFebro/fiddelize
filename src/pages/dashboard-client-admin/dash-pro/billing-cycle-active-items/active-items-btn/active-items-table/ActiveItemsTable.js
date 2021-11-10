import { useState, useEffect } from "react";
import MuSelectTable from "components/tables/MuSelectTable";
import usePro from "init/pro";
// import showToast from "components/toasts";

const getHeadCells = (isGoldPlan = false) => [
    { id: "service", label: "Serviço", numeric: false, disablePadding: false },
    {
        id: "currCredits",
        label: "Total Créditos Atual",
        numeric: !isGoldPlan, // it is Infinity, it should be a string
        align: "center",
        disablePadding: false,
    },
    {
        id: "creditTypeBrTooltip",
        label: "Tipo de Crédito",
        align: "center",
        disablePadding: false,
    },
    {
        id: "expirable",
        label: "créditos não usados expiram?",
        align: "center",
        disablePadding: false,
    },
];

export default function ActiveItemsTable({ planList = [], loading }) {
    const [rowsData, setRowsData] = useState([]);

    const { plan } = usePro();
    const isGoldPlan = plan === "ouro";

    useEffect(() => {
        setRowsData(planList);
    }, [planList]);

    return (
        <section className="my-5">
            <h1 className="mt-5 text-subtitle font-weight-bold text-center">
                Todos serviços ativos
            </h1>
            <MuSelectTable
                headCells={getHeadCells(isGoldPlan)}
                rowsData={rowsData}
                loading={loading}
                needMainTitle={false}
                needHighlightColor={false}
                marginBottom=" "
                enumeration="number"
            />
        </section>
    );
}
