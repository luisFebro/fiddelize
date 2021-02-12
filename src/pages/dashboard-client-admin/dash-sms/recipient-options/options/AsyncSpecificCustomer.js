import React, { useState, Fragment, useEffect } from "react";
import AutoCompleteSearch from "../../../../../components/search/AutoCompleteSearch";
import { useProfile } from "../../../../../hooks/useRoleData";
import RadiusBtn from "../../../../../components/buttons/RadiusBtn";
import { Load } from "../../../../../components/code-splitting/LoadableComp";
import ShowSelectionArea from "./comps/ShowSelectionArea";
import { useRunComp } from "../../../../../hooks/useRunComp";
import useAPI, { readContacts } from "../../../../../hooks/api/useAPI";
import { useStoreDispatch } from "easy-peasy";
import { showSnackbar } from "../../../../../redux/actions/snackbarActions";
import { API } from "../../../../../config/api.js";

const AsyncShowNewContactForm = Load({
    loader: () =>
        import(
            "./comps/AsyncShowNewContactForm" /* webpackChunkName: "form-specific-client-sms-lazy" */
        ),
});

export default function AsyncSpecificCustomer({
    handleList,
    handleShowMessage,
}) {
    const [data, setData] = useState({
        selectedValue: "",
    });

    const { selectedValue } = data;

    const dispatch = useStoreDispatch();

    const { runName, runOneArray } = useRunComp();
    let { _id: userId } = useProfile();

    const params = { contactFrom: selectedValue };
    const trigger = selectedValue;
    const { data: newAddedContact } = useAPI({
        url: readContacts(userId),
        params,
        trigger,
        needAuth: true,
    });

    useEffect(() => {
        if (newAddedContact) {
            if (!newAddedContact.length)
                return showSnackbar(
                    dispatch,
                    "Contato não está mais disponível!",
                    "error"
                );
            const { name, phone } = newAddedContact[0];
            handleAddContact({ name, phone });
        }
    }, [newAddedContact]);

    const [list, setList] = useState([]);
    const [newContactOpen, setNewContactOpen] = useState(false);

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

    const handleRemoveLast = () => {
        setList((data) => {
            data.shift();
            return [...data];
        });
    };

    const handleClearAll = () => {
        setList([]);
    };

    const handleAddContact = ({ name, phone }) => {
        setList((data) => {
            const namesAddedList = data.map((contact) =>
                contact.name.toLowerCase()
            );
            if (namesAddedList.indexOf(name.toLowerCase()) !== -1) {
                showSnackbar(
                    dispatch,
                    "Nome de contato já adicionado.",
                    "error"
                );
                return [...data];
            }
            data.unshift({ name, phone });
            return [...data];
        });
    };

    const showSearch = () => {
        const autocompleteUrl = `${API}/sms/read/contacts?userId=${userId}&autocomplete=true`;

        const handleNewContact = () => {
            setNewContactOpen((prev) => !prev);
        };

        return (
            <section className="my-3">
                <AutoCompleteSearch
                    autocompleteUrl={autocompleteUrl}
                    setData={setData}
                    placeholder="Procure cliente"
                    noOptionsText="Nenhum cliente encontrado"
                    disableOpenOnFocus={true}
                    offlineKey="valuesHistory_specificCustomerSMS"
                />
                <div
                    className={`d-flex justify-content-end ${
                        !newContactOpen ? "mt-2" : "mt-5"
                    }`}
                >
                    {!newContactOpen && (
                        <span className="d-inline-block text-normal text-purple font-weight-bold mr-2">
                            ou
                        </span>
                    )}
                    <RadiusBtn
                        title={newContactOpen ? "fechar" : "novo contato"}
                        position="relative"
                        onClick={handleNewContact}
                        backgroundColor={
                            newContactOpen
                                ? "var(--mainDark)"
                                : "var(--themeSDark)"
                        }
                    />
                </div>
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
            {showSearch()}
            {newContactOpen && (
                <AsyncShowNewContactForm handleAddContact={handleAddContact} />
            )}
            {showSelectionArea()}
        </section>
    );
}
