import { Fragment } from "react";
import LoadableVisible from "../../../../components/code-splitting/LoadableVisible";

const AsyncTeamTasksList = LoadableVisible({
    loading: true,
    loader: () =>
        import(
            "./cards-list/AsyncTeamTasksList.js" /* webpackChunkName: "staff-tasks-pro-cards-list-session-lazy" */
        ),
});

export default function AsyncTasks() {
    return (
        <Fragment>
            <AsyncTeamTasksList />
        </Fragment>
    );
}
