import { useState, useEffect } from "react";
import MuSelectTable from "components/tables/MuSelectTable";
// import showToast from "components/toasts";

const headCells = [
    { id: "service", label: "Serviço", numeric: false, disablePadding: false },
    {
        id: "currCredits",
        label: "Total Créditos Atual",
        numeric: true,
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

    useEffect(() => {
        setRowsData(planList);
    }, [planList]);

    return (
        <section className="my-5">
            <h1 className="mt-5 text-subtitle font-weight-bold text-center">
                Todos serviços ativos
            </h1>
            <MuSelectTable
                headCells={headCells}
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
