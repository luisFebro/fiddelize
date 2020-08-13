import React from 'react';
import { useProfile, getFirstName } from '../../../../../hooks/useRoleData';
import ButtonFab from '../../../../../components/buttons/material-ui/ButtonFab';

export default function AsyncChargeCredits() {
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
            Poxa, {getFirstName(name)}! Seu saldo de 100 créditos não é suficiente para 150 envios.
            <br />
            <br />
            Recarregue seus créditos ou continue enviando para mais 100 contatos.
        </section>
    );

    const showCTA = () => (
        <section className="container-center my-5">
            <ButtonFab
                size="large"
                title="Recarregar"
                position="relative"
                onClick={null}
                backgroundColor={"var(--themeSDark--default)"}
                variant = 'extended'
            />
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