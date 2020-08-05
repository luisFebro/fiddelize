import React, { useState, useEffect } from 'react';
import MuSelectTable from '../../../../../components/tables/MuSelectTable';
import { useRunComp } from '../../../../../hooks/useRunComp';

const customerData = [
  { name: "Ana Beatriz", phone: "(92) 99281-7355" },
  { name: "Beatriz Lima", phone: "(92) 99281-7353" },
  { name: "Carlos Eduardo", phone: "(92) 98281-7353" },
  { name: "Denis Lima", phone: "(92) 98281-7353" },
  { name: "Eduardo Augusto", phone: "(92) 98281-7354" },
  { name: "Fernando Luis", phone: "(92) 98281-7359" },
  { name: "Gustavo Oliveira", phone: "(92) 98281-7310" },
  { name: "Helen Rocha", phone: "(92) 95281-7310" },
  { name: "Igo Lins", phone: "(92) 95211-7310" },
  { name: "Jéssica Alburquerque", phone: "(92) 95211-7314" },
  { name: "Kelly Noronha", phone: "(92) 95219-7314" },
  { name: "Leonardo Oliveira", phone: "(92) 95219-7318" },
  { name: "Maria de Jesus", phone: "(92) 95219-7319" },
];
export default function AsyncAllCustomers({ handleList, handleShowMessage }) {
    const [list, setList] = useState([...customerData]); // it will be useAPI instead.
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [emptySelection, setEmptySelection] = useState(false);
    const [init, setInit] = useState(true);

    const { runName } = useRunComp();

    const totalSelected = selectedContacts.length;
    const isSendEverybodyMode = Boolean(totalSelected !== 0 && list.length === totalSelected);

    useEffect(() => {
        const getList = () => {
            if(isSendEverybodyMode) {
                return list;
            } else {
                const filteredSelectedList = list.filter(contact => {
                    return selectedContacts.indexOf(contact.name) !== -1;
                })
                return filteredSelectedList;
            }
        }

        const runSelection = selectedContacts.length || selectedContacts.length === 0;
        if(runName === "Lista de Clientes" || init || runSelection) {
            const selectedList = getList();
            handleList(selectedList);
            isSendEverybodyMode && setInit(false);
        }
    }, [list, init, selectedContacts, isSendEverybodyMode, runName])

    useEffect(() => {
        if(!selectedContacts.length) handleShowMessage(false);
    }, [selectedContacts])

    useEffect(() => {
        if(runName === "Lista de Clientes") {
            setSelectedContacts([]);
            setEmptySelection(true);
        }
    }, [runName])

    const checkSelected = newSelection => {
        setEmptySelection(false);
        setSelectedContacts(newSelection);
    }

    return (
        <section className="all-customers--root">
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
            <MuSelectTable
                callback={checkSelected}
                rowsData={list}
                emptySelection={emptySelection}
            />
        </section>
    );
}