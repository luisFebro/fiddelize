import { Fragment } from "react";
import Title from "../../../../../components/Title";
import LoadableVisible from "../../../../../components/code-splitting/LoadableVisible";

const AsyncIncomeCardsList = LoadableVisible({
    loading: true,
    loader: () =>
        import(
            "./cards-list/AsyncIncomeCardsList.js" /* webpackChunkName: "income-cards-list-session-lazy" */
        ),
});

export default function IncomeHistory() {
    return (
        <Fragment>
            <Title
                title="&#187; Histórico de Ganhos"
                color="var(--themeP)"
                margin="mt-5"
                padding=" "
            />
            <AsyncIncomeCardsList />
        </Fragment>
    );
}
