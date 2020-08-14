import React from 'react';
import { useProfile, getFirstName } from '../../../../../hooks/useRoleData';
import AddSMSBtn from '../../credits-balance/add-sms-btn/AddSMSBtn';

export default function AsyncChargeCredits({
    currBalance,
    totalRecipients,
}) {
    const { name } = useProfile();

    const showTitle = () => (
        <div className="mt-5">
            <p
                className="text-subtitle text-purple text-center font-weight-bold"
            >
                Créditos Insuficientes
            </p>
        </div>
    );

    const showIllustra = () => (
        <section className="my-5 mx-5">
            <img
                className="img-fluid"
                src="/img/illustrations/sms-charge.svg"
                alt="sem créditos"
            />
        </section>
    );

    const showMsg = () => (
        <section className="mb-5 text-purple text-normal mx-3">
            Poxa, {getFirstName(name)}! Seu <strong>saldo de {currBalance} créditos</strong> não é suficiente para {totalRecipients} envios.
            <br />
            <br />
            Recarregue seus créditos ou continue enviando para mais {currBalance} contatos.
        </section>
    );

    const showCTA = () => (
        <section className="container-center my-5">
            <AddSMSBtn btnTitle="Recarregar" />
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