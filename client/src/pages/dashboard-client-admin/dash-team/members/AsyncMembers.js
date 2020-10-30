import React, { Fragment } from "react";
import LoadableVisible from "../../../../components/code-splitting/LoadableVisible";

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
            <AsyncMembersList />
        </Fragment>
    );
}
