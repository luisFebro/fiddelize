import { useState, Fragment, useEffect } from "react";
import AutoCompleteSearch from "../../../../../../../components/search/AutoCompleteSearch";
import ShowSelectionArea from "./comps/ShowSelectionArea";
import useRun from "global-data/ui";
import { ROOT } from "api/root";
import SelectField from "../../../../../../../components/fields/SelectField";
import showToast from "../../../../../../../components/toasts";
import useAPI, { readUserSubIds } from "api/useAPI";

const defaultSelected = "selecione tipo app:";

export default function SelectedUsers({
    handleList,
    handleShowMessage,
    handleAppType,
}) {
    const [data, setData] = useState({
        selectedValue: "",
        selectedApp: defaultSelected,
    });

    const { runName, runOneArray } = useRun();

    const [list, setList] = useState([]);

    const { selectedValue, selectedApp } = data;
    const showSearchField = selectedApp !== "selecione tipo app:";

    useEffect(() => {
        if (selectedApp && showSearchField) handleAppType(selectedApp);
        // eslint-disable-next-line
    }, [selectedApp, showSearchField]);

    const params = {
        role: selectedApp,
        userName: selectedValue,
    };

    const { data: newAddedUser } = useAPI({
        url: readUserSubIds(),
        params,
        trigger: showSearchField && selectedValue,
        needAuth: true,
    });

    const handleAddedUser = ({ name, userId }) => {
        setList((data) => {
            const namesAddedList = data.map((userData) =>
                userData.name.toLowerCase()
            );
            if (namesAddedList.indexOf(name.toLowerCase()) !== -1) {
                showToast("Nome já foi adicionado!", { type: "error" });
                return [...data];
            }
            data.unshift({ name, userId });
            return [...data];
        });
    };

    useEffect(() => {
        if (newAddedUser) {
            if (!newAddedUser.length) return;

            handleAddedUser(newAddedUser[0]);
        }

        // eslint-disable-next-line
    }, [newAddedUser]);

    useEffect(() => {
        if (runName === "Contatos Selecionados") handleList(list);
        if (!list.length) handleShowMessage(false);
        handleList(list);
    }, [list, runName]);

    useEffect(() => {
        if (runName === "asyncExtractList") {
            setList(runOneArray);
            handleList(runOneArray);
        }
    }, [runName, runOneArray]);

    const showSelectAppField = () => {
        const handleSelectedApp = (val) => {
            setData({
                ...data,
                selectedApp: val,
            });
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

    const handleRemoveLast = () => {
        setList((data) => {
            data.shift();
            return [...data];
        });
    };

    const handleClearAll = () => {
        setList([]);
    };

    const showSearch = () => {
        const autocompleteUrl = `${ROOT}/push-notification/read/sub-ids?role=${selectedApp}`;

        return (
            <section className="my-3 animated fadeInUp">
                <AutoCompleteSearch
                    autocompleteUrl={autocompleteUrl}
                    setData={setData}
                    placeholder="Procure Usuário"
                    noOptionsText="Nenhum usuário encontrado"
                    disableOpenOnFocus
                    offlineKey="subUserIds"
                />
            </section>
        );
    };

    const showSelectionArea = () => (
        <Fragment>
            {!list.length ? (
                <section className="text-center text-subtitle font-weight-bold text-purple my-5">
                    Nenhum selecionado
                </section>
            ) : (
                <ShowSelectionArea
                    list={list}
                    handleRemoveLast={handleRemoveLast}
                    handleClearAll={handleClearAll}
                />
            )}
        </Fragment>
    );

    return (
        <section>
            {showSelectAppField()}
            {showSearchField && showSearch()}
            {showSelectionArea()}
        </section>
    );
}
