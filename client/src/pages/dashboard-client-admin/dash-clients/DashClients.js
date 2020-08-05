import React, { useEffect, useState } from 'react';
import DashSectionTitle from '../../DashSectionTitle';
// COMPONENTS
import RankingPondium from './RankingPondium';
import AutomaticToDoList from './automatic-to-do-list';
import { useProfile, useClientAdmin } from '../../../hooks/useRoleData';
import LoadableVisible from '../../../components/code-splitting/LoadableVisible';

const AsyncRecordedClientsList = LoadableVisible({ logo: true, loading: true, loader: () => import('./clients-history/AsyncRecordedClientsList'  /* webpackChunkName: "clients-history-session-lazy" */ )});
// END COMPONENTS


const Title = ({ bizName }) => {
    return(
        <span className="text-subtitle font-weight-bold">
            Clientes da
            <br />
            <span className="text-title">{bizName && bizName.cap()}</span>
        </span>
    );
};

export default function DashClients() {
    const { bizName } = useClientAdmin();
    const { name } = useProfile();

    const sectionTitle = React.useMemo(() => <Title bizName={bizName} />, [bizName]);

    return (
        <div>
            <DashSectionTitle
                title={sectionTitle}
            />
            <AutomaticToDoList />
            <hr className="lazer-purple"/>
            <RankingPondium />
            <hr className="lazer-purple"/>
            <AsyncRecordedClientsList />
        </div>
    );
}
