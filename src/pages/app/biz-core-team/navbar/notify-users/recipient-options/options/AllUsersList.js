import { useState, useEffect, Fragment } from "react";
import MuSelectTable from "../../../../../../../components/tables/MuSelectTable";
import { useRunComp } from "../../../../../../../hooks/useRunComp";
import useAPI, { readUserSubIds } from "../../../../../../../hooks/api/useAPI";
import SelectField from "../../../../../../../components/fields/SelectField";

const headCells = [
    {
        id: "name",
        numeric: false,
        disablePadding: false,
        label: "Nome Cliente",
    },
    {
        id: "userId",
        numeric: false,
        disablePadding: false,
        label: "Id Usuário",
    },
];

const defaultSelected = "selecione tipo app:";

export default function AllUsersList({
    handleList,
    handleShowMessage,
    handleAppType,
}) {
    const [selectedApp, setSelectedApp] = useState(defaultSelected);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [emptySelection, setEmptySelection] = useState(false);
    const [init, setInit] = useState(true);

    const needRunApi =
        selectedApp !== "selecione tipo app:" || selectedApp !== "";

    const params = {
        role: selectedApp,
    };

    let { data: list, loading = false } = useAPI({
        url: readUserSubIds(),
        params,
        needAuth: true,
        trigger: needRunApi && selectedApp,
        dataName: "allPushSubList",
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
                (user) => selectedContacts.indexOf(user.name) !== -1
            );
            return filteredSelectedList;
        };

        const runSelection =
            selectedContacts.length || selectedContacts.length === 0;
        if (runName === "Lista de Usuários" || init || runSelection) {
            const selectedList = getList();
            handleList(selectedList);
            isSendEverybodyMode && setInit(false);
        }
    }, [list, init, selectedContacts, isSendEverybodyMode, runName]);

    useEffect(() => {
        if (selectedApp && needRunApi) handleAppType(selectedApp);
        // eslint-disable-next-line
    }, [selectedApp, needRunApi]);

    useEffect(() => {
        if (!selectedContacts.length) handleShowMessage(false);
    }, [selectedContacts]);

    useEffect(() => {
        if (runName === "Lista de Usuários") {
            setSelectedContacts([]);
            setEmptySelection(true);
        }
    }, [runName]);

    const checkSelected = (newSelection) => {
        setEmptySelection(false);
        setSelectedContacts(newSelection);
    };

    const showSelectAppField = () => {
        const handleSelectedApp = (val) => {
            setSelectedApp(val);
        };

        const valuesArray = [
            { val: "nucleo-equipe", showVal: "App Fiddelize" },
            { val: "cliente-admin", showVal: "App Admin" },
            { val: "cliente-membro", showVal: "App Membro" },
            { val: "cliente", showVal: "App Cliente" },
        ];

        return (
            <SelectField
                title={defaultSelected}
                valuesArray={valuesArray}
                handleValue={handleSelectedApp}
            />
        );
    };

    const showNoUsersMsg = Boolean(
        !list.length && selectedApp !== defaultSelected
    );
    const showMode = () =>
        !loading && (
            <Fragment>
                {showNoUsersMsg && (
                    <div className="text-title mode text-center text-grey">
                        NENHUM USUÁRIO NESTE APP
                        <span className="d-block text-normal text-grey text-center">
                            Todos os usuários inscritos para receber
                            notificações aparecerão aqui.
                        </span>
                    </div>
                )}

                {Boolean(list.length) && (
                    <div className="text-title mode text-center text-purple">
                        MODO:
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
                    </div>
                )}
            </Fragment>
        );

    return (
        <section className="all-users--root">
            {showSelectAppField()}
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
