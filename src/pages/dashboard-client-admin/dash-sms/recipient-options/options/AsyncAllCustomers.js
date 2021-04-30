import { useState, useEffect, Fragment } from "react";
import MuSelectTable from "../../../../../components/tables/MuSelectTable";
import { useRunComp } from "../../../../../hooks/useRunComp";
import useAPI, { readContacts } from "../../../../../hooks/api/useAPI";
import { useProfile } from "init";

const headCells = [
    {
        id: "name",
        numeric: false,
        disablePadding: false,
        label: "Nome Cliente",
    },
    { id: "phone", numeric: false, disablePadding: false, label: "Contato" },
];

export default function AsyncAllCustomers({ handleList, handleShowMessage }) {
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [emptySelection, setEmptySelection] = useState(false);
    const [init, setInit] = useState(true);

    const { userId } = useProfile();
    let { data: list, loading } = useAPI({
        url: readContacts(userId),
        needAuth: true,
        dataName: "allSMSContactList",
    });
    if (!list) list = [];

    const { runName } = useRunComp();

    const totalSelected = selectedContacts.length;
    const isSendEverybodyMode = Boolean(
        totalSelected !== 0 && list.length === totalSelected
    );

    useEffect(() => {
        if (list.length)
            setSelectedContacts(list.map((contact) => contact.name));
    }, [list]);

    useEffect(() => {
        const getList = () => {
            if (isSendEverybodyMode) {
                return list;
            }
            const filteredSelectedList = list.filter(
                (contact) => selectedContacts.indexOf(contact.name) !== -1
            );
            return filteredSelectedList;
        };

        const runSelection =
            selectedContacts.length || selectedContacts.length === 0;
        if (runName === "Lista de Clientes" || init || runSelection) {
            const selectedList = getList();
            handleList(selectedList);
            isSendEverybodyMode && setInit(false);
        }
    }, [list, init, selectedContacts, isSendEverybodyMode, runName]);

    useEffect(() => {
        if (!selectedContacts.length) handleShowMessage(false);
    }, [selectedContacts]);

    useEffect(() => {
        if (runName === "Lista de Clientes") {
            setSelectedContacts([]);
            setEmptySelection(true);
        }
    }, [runName]);

    const checkSelected = (newSelection) => {
        setEmptySelection(false);
        setSelectedContacts(newSelection);
    };

    const showMode = () =>
        !loading && (
            <Fragment>
                {!list.length ? (
                    <p className="text-title mode text-center text-grey">
                        SEM CLIENTES
                        <span className="d-block text-normal text-grey text-center">
                            Cadastre clientes!
                            <br />
                            Todos aparecerão aqui.
                        </span>
                    </p>
                ) : (
                    <p className="text-title mode text-center text-purple">
                        MODO:
                        <br />
                        <br />
                        {isSendEverybodyMode ? (
                            <span>Todos da Lista</span>
                        ) : (
                            <span>Somente Marcados</span>
                        )}
                        <br />
                        <span className="text-subtitle text-purple text-center">
                            (Total: {totalSelected} clientes)
                        </span>
                    </p>
                )}
            </Fragment>
        );

    return (
        <section className="all-customers--root">
            {showMode()}
            <MuSelectTable
                headCells={headCells}
                rowsData={list}
                loading={loading}
                callback={checkSelected}
                emptySelection={emptySelection}
            />
        </section>
    );
}
