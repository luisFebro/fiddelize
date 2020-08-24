import React, { useEffect, useState } from 'react';
import DashSectionTitle from '../../DashSectionTitle';
// COMPONENTS
// import RankingPondium from './RankingPondium';
import AutomaticToDoList from './automatic-to-do-list';
import { useProfile, useClientAdmin } from '../../../hooks/useRoleData';
import LoadableVisible from '../../../components/code-splitting/LoadableVisible';

const AsyncRankingPondium = LoadableVisible({ loader: () => import('./RankingPondium'  /* webpackChunkName: "podium-comp-lazy" */ )});
const AsyncRecordedClientsList = LoadableVisible({ logo: true, loading: true, loader: () => import('./clients-history/AsyncRecordedClientsList'  /* webpackChunkName: "clients-history-session-lazy" */ )});
// END COMPONENTS


const getTitle = (bizName) => (
    <span className="text-subtitle font-weight-bold">
        Clientes da
        <br />
        <span className="text-title">{bizName && bizName.cap()}</span>
    </span>
);

export default function DashClients() {
    const { bizName } = useClientAdmin();
    const { name } = useProfile();

    const SectionTitle = getTitle(bizName);

    return (
        <div>
            <DashSectionTitle
                title={SectionTitle}
            />
            <AutomaticToDoList />
            <hr className="lazer-purple"/>
            <AsyncRankingPondium />
            <AsyncRecordedClientsList />
        </div>
    );
}
