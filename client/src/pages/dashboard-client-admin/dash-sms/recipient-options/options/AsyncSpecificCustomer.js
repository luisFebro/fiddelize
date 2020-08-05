import React, { useState, Fragment, useEffect } from 'react';
import AutoCompleteSearch from '../../../../../components/search/AutoCompleteSearch';
import { useProfile } from '../../../../../hooks/useRoleData';
import getFirstName from '../../../../../utils/string/getFirstName';
import RadiusBtn from '../../../../../components/buttons/RadiusBtn';
import { Load } from '../../../../../components/code-splitting/LoadableComp';
import ShowSelectionArea from './comps/ShowSelectionArea';
import { useRunComp } from '../../../../../hooks/useRunComp';

const AsyncShowNewContactForm = Load({ loader: () => import('./comps/AsyncShowNewContactForm' /* webpackChunkName: "form-specific-client-sms-lazy" */)});

export default function AsyncSpecificCustomer({ handleList, handleShowMessage }) {
    const [list, setList] = useState([]);
    const [search, setSearch] = useState([]);
    const [newContactOpen, setNewContactOpen] = useState(false);

    const { runName } = useRunComp();
    useEffect(() => {
        if(runName === "Contatos Selecionados") handleList(list);
        if(!list.length) handleShowMessage(false);
    }, [list, runName])

    let { name: adminName } = useProfile();
    adminName = getFirstName(adminName);

    const handleRemoveLast = () => {
        setList(data => {
            data.shift();
            return [...data];
        })
    }

    const handleAddContact = ({ name, phone }) => {
        setList(data => {
            data.unshift({ name, phone })
            return [...data];
        })
    }

    const showSearch = () => {
        const autoCompleteUrl = `/api/finance/cash-ops/list/all?search=a&autocomplete=true`;

        const handleNewContact = () => {
            setNewContactOpen(prev => !prev);
        }
        return(
            <section className="my-3">
                <AutoCompleteSearch
                    url={autoCompleteUrl}
                    setSearch={setSearch}
                    noOptionsText={`Nada encontrado, ${adminName}`}
                    disableOpenOnFocus={true}
                    placeholder="Procure cliente"
                />
                <div className={`d-flex justify-content-end ${!newContactOpen ? "mt-2" : "mt-5"}`}>
                    {!newContactOpen && (
                        <span className="d-inline-block text-normal text-purple font-weight-bold mr-2">
                            ou
                        </span>
                    )}
                    <RadiusBtn
                        title={newContactOpen ? "fechar" : "novo contato"}
                        position="relative"
                        onClick={handleNewContact}
                        backgroundColor={newContactOpen ? 'var(--mainDark)' : 'var(--themeSDark)'}
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
            ) : <ShowSelectionArea list={list} handleRemoveLast={handleRemoveLast} />}
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