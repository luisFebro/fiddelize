import React from 'react';
import { useProfile, getFirstName } from '../../../../../hooks/useRoleData';
import AddSMSBtn from '../../credits-balance/add-sms-btn/AddSMSBtn';

export default function AsyncNoCredits() {
    const { name } = useProfile();

    const showTitle = () => (
        <div className="mt-5">
            <p
                className="text-subtitle text-purple text-center font-weight-bold"
            >
                Sem Créditos SMS.
            </p>
        </div>
    );

    const showIllustra = () => (
        <section className="my-5 mx-5">
            <img
                className="img-fluid"
                src="/img/illustrations/empty-sms-credits.svg"
                alt="sem créditos"
            />
        </section>
    );

    const showMsg = () => (
        <section className="mb-5 text-purple text-normal mx-3">
            Ei, parece que seu saldo está parado para envios. {getFirstName(name)}, invista e traga a <strong>força dos SMS</strong> para seu projeto.
        </section>
    );

    const showCTA = () => (
        <section className="container-center my-5">
            <AddSMSBtn btnTitle="Investir" />
        </section>
    );

    return (
        <section>
            {showTitle()}
            {showIllustra()}
            {showMsg()}
            {showCTA()}
        </section>
    );
}