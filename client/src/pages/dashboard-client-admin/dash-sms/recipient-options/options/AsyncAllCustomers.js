import React, { useState } from 'react';
import MuSelectTable from '../../../../../components/tables/MuSelectTable';

export default function AsyncAllCustomers() {
    const [dataContacts, setDataContacts] = useState(13) // array of data
    const [selectedContacted, setSelectedContacted] = useState([]);

    const checkSelected = newSelection => {
        setSelectedContacted(newSelection);
    }

    const isSendEverybodyMode = Boolean(selectedContacted.length && dataContacts === selectedContacted.length);
    const totalSelected = selectedContacted.length;

    return (
        <section className="all-customers--root">
            <p className="text-title mode text-center text-purple">
                MODO:
                <br />
                <br />
                {isSendEverybodyMode ? (
                    <span>Todos da Lista</span>
                ) : (
                    <span>Grupo Selecionado</span>
                )}
                <br />
                <span className="text-subtitle text-purple text-center">
                  (Total: {totalSelected} clientes)
                </span>
            </p>
            <MuSelectTable callback={checkSelected} />
        </section>
    );
}