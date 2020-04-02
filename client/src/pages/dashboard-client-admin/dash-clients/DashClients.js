import React from 'react';
import ClientsHistory from './clients-history/ClientsHistory';
import DashSectionTitle from '../../DashSectionTitle';
import RankingPondium from './RankingPondium';
import NotificationArea from './notification-area/NotificationArea';
import { useProfile, useClientAdmin } from '../../../hooks/useRoleData';

const Title = ({ bizName }) => {
    return(
        <span className="text-subtitle font-weight-bold">
            Clientes de
            <br />
            <span className="text-title">{bizName && bizName.cap()}</span>
        </span>
    );
};

export default function DashClients() {
    const { bizName } = useClientAdmin();
    const { name } = useProfile();

    return (
        <div>
            <DashSectionTitle
                title={<Title bizName={bizName} />}
            />
            <NotificationArea userName={name} />
            <hr />
            <RankingPondium />
            <hr />
            <ClientsHistory />
        </div>
    );
}
