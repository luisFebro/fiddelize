import { Fragment } from "react";
import LoadableVisible from "components/code-splitting/LoadableVisible";
import Title from "components/Title";
import ProCreditsBadge from "components/pro/ProCreditsBadge";

const AsyncRankingPondium = LoadableVisible({
    loading: true,
    loader: () =>
        import(
            "./RankingPondium.js" /* webpackChunkName: "team-ranking-comp-lazy" */
        ),
});

const AsyncMembersList = LoadableVisible({
    loading: true,
    loader: () =>
        import(
            "./cards-list/AsyncMembersList.js" /* webpackChunkName: "staff-tasks-pro-cards-list-session-lazy" */
        ),
});

export default function AsyncMembers() {
    return (
        <Fragment>
            <Title
                title="&#187; Pódio Equipe"
                subTitle="todos os tempos"
                color="var(--themeP)"
                margin="mb-5"
                padding=" "
            />
            <AsyncRankingPondium />
            <p className="ml-3 text-purple font-weight-bold text-subtitle">
                Membros:
            </p>
            <div className="container-center mt-5">
                <ProCreditsBadge service="Connecta Membros" />
            </div>
            <AsyncMembersList />
        </Fragment>
    );
}
