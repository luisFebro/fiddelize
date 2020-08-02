import React from 'react';
import MuSelectTable from '../../../../../components/tables/MuSelectTable';

export default function AsyncAllCustomers() {
    return (
        <section className="all-customers--root">
            <p className="text-title mode text-center text-purple">
                MODO:
                <br />
                <br />
                Enviar para todos
                <br />
                <span className="text-subtitle text-purple text-center">
                  (Total: 150 clientes)
                </span>
            </p>
            <MuSelectTable />
        </section>
    );
}