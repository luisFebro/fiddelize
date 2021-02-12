import React from "react";
import Title from "../../../../components/Title";
import { useAppSystem } from "../../../../hooks/useRoleData";
import LoadableVisible from "../../../../components/code-splitting/LoadableVisible";

const AsyncInvestCardsList = LoadableVisible({
    loading: true,
    loader: () =>
        import(
            "./cards-list/AsyncInvestCardsList.js" /* webpackChunkName: "invest-pro-cards-list-session-lazy" */
        ),
});

export default function InvestHistory() {
    const { businessId: userId } = useAppSystem();

    return (
        <section>
            <Title
                title="&#187; Histórico de Investimentos"
                color="var(--themeP)"
                margin="mt-5"
                padding=" "
            />
            <AsyncInvestCardsList />
        </section>
    );
}

/* ARCHIVES
const showTotals = () => {
    const plural = transitionTotal >= 2 ? "ões" : "ão"

    return(
        <div
            className="ml-3 mb-5 text-purple text-subtitle font-weight-bold position-relative"
            id="smsHistoryTotals"
        >
            <span className="text-title">Totais Gerais:</span>
            <br />
            <strong>• {`${transitionTotal} operaç${plural}`}</strong>
            <br />
            <strong>• {`${smsSentTotal} SMS enviados`}</strong>
        </div>
    );
}
 */
