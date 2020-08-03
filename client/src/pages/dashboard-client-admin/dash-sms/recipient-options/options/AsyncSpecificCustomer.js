import React, { useState, Fragment } from 'react';
import AutoCompleteSearch from '../../../../../components/search/AutoCompleteSearch';
import { useProfile } from '../../../../../hooks/useRoleData';
import getFirstName from '../../../../../utils/string/getFirstName';
import RadiusBtn from '../../../../../components/buttons/RadiusBtn';

export default function AsyncSpecificCustomer() {
    const [search, setSearch] = useState([]);
    const [newContactOpen, setNewContactOpen] = useState(false);

    let { name: adminName } = useProfile();
    adminName = getFirstName(adminName);


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
                <div className=" d-flex justify-content-end mt-2">
                    <span className="d-inline-block text-normal text-purple font-weight-bold mr-2">
                        ou
                    </span>
                    <RadiusBtn
                        title="novo contato"
                        position="relative"
                        onClick={handleNewContact}
                    />
                </div>
            </section>
        );
    };

    const showSelectionArea = () => (
        <Fragment>
            {newContactOpen
            ? (
                <section className="text-center text-subtitle font-weight-bold text-purple my-5">
                    Area component
                </section>
            ) : (
                <section className="text-center text-subtitle font-weight-bold text-purple my-5">
                    Nenhum selecionado.
                </section>
            )}

        </Fragment>

    );

    return (
        <section>
            {showSearch()}
            {showSelectionArea()}
        </section>
    );
}