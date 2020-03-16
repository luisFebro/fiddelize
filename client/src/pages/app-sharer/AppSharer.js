import React from 'react';
import getQueryByName from '../../utils/string/getQueryByName';

export default function AppSharer({ location }) {
    const role = getQueryByName("role", location.search);


    const backBtn = () => (
        <div>
            Hello
        </div>
    );

    const showHeader = () => (
        <header className="mt-5 container-center">
            <span className="text-hero">
                Comparti-<br />
                -lhador do App
            </span>
            <br />
            <span className="text-title">
                Divulgue seu app de fidelidade<br />para seus clientes ou contatos.
            </span>
        </header>
    );

    return (
        <div className="text-white text-center">
            {showHeader()}
        </div>
    );
}