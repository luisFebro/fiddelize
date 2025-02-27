import Title from "../../../../components/Title";
import LoadableVisible from "../../../../components/code-splitting/LoadableVisible";
import useAPI, { getGeneralTotals, needTrigger } from "api/useAPI";
import useRun from "global-data/ui";
import { useBizData } from "init";

const AsyncSmsCardsList = LoadableVisible({
    loading: true,
    loader: () =>
        import(
            "./cards-list/AsyncCardsList.js" /* webpackChunkName: "sms-cards-list-session-lazy" */
        ),
});

export default function SmsHistory() {
    const { bizId: userId } = useBizData();

    const { runName } = useRun();
    const trigger = needTrigger(runName, "UpdateSMSAll");
    const { data, loading } = useAPI({
        url: getGeneralTotals(userId),
        dataName: "smsGeneralTotals",
        trigger,
    });
    const transitionTotal = loading ? "..." : data ? data.operations : "";
    const smsSentTotal = loading ? "..." : data ? data.totalSMS : "";

    const showTotals = () => {
        const plural = transitionTotal >= 2 ? "ões" : "ão";

        return (
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
    };

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
