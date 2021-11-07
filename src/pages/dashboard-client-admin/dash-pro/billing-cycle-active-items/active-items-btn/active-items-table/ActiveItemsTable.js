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
        id: "invCredits",
        label: "Total Créditos Investido",
        numeric: true,
        align: "center",
        disablePadding: false,
    },
];

export default function ActiveItemsTable({ itemList = [], loading }) {
    const [rowsData, setRowsData] = useState([]);

    useEffect(() => {
        setRowsData(itemList);
    }, [itemList]);

    return (
        <section className="my-5">
            <h1 className="mt-5 text-subtitle font-weight-bold text-center">
                Lista de serviços ativos
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
