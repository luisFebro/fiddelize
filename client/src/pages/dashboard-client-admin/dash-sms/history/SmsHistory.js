import React from 'react';
import Title from '../../../../components/Title';
import LoadableVisible from '../../../../components/code-splitting/LoadableVisible';

const AsyncSmsCardsList = LoadableVisible({ loading: true, loader: () => import('./cards-list/AsyncCardsList.js'  /* webpackChunkName: "sms-cards-list-session-lazy" */ )});

export default function SmsHistory() {

    const showTotals = () => {
        const transitionTotal = 25;
        const smsSentTotal = 1500;
        const plural = transitionTotal >= 2 ? "ões" : "ão"

        return(
            <div className="mb-5 text-purple text-subtitle font-weight-bold position-relative">
                <span className="text-title">Totais Gerais:</span>
                <br />
                <strong>• {`${transitionTotal} operaç${plural}`}</strong>
                <br />
                <strong>• {`${smsSentTotal} SMS enviados`}</strong>
            </div>
        );
    }

    return (
        <section>
            <Title
                title="&#187; Histórico SMS"
                color="var(--themeP)"
                margin="my-5"
                padding=" "
            />
            {showTotals()}
            <AsyncSmsCardsList />
        </section>
    );
}