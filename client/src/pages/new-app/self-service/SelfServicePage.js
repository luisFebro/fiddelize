import React from 'react';
import AppPreview from './AppPreview';
import AppPickersHandler from './pickers/AppPickersHandler';
import getQueryByName from '../../../utils/string/getQueryByName';
import getFirstName from '../../../utils/string/getFirstName';
import './style.scss';

export default function SelfServicePage({ location, match }) {
    const bizId = match.params.bizId;
    const getBizName = getQueryByName("negocio", location.search); // this is optional for when it is in testing mode.
    const bizName = getBizName && getBizName.cap();
    let clientName = getQueryByName("nome-cliente", location.search).cap();
    clientName = getFirstName(clientName);
    const isTest = location.search.includes("teste=1");

    const showTitle = () => (
        <div className="text-center text-white my-4">
            <p className="text-title">Self-Service</p>
        </div>
    );

    return (
        <div style={{overflow: 'hidden'}}>
            {showTitle()}
            <div className="main-self-service">
                <section className="picker-area">
                    <p className="title text-subtitle text-center text-white">
                        Personalize o App dos clientes
                    </p>
                    <AppPickersHandler
                        bizId={bizId}
                        bizName={bizName}
                        clientName={clientName}
                        isTest={isTest}
                    />
                </section>
                <AppPreview clientName={clientName} />
            </div>
        </div>
    );
}

/*
 */
