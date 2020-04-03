import React from 'react';
import ClientsHistory from './clients-history/ClientsHistory';
import DashSectionTitle from '../../DashSectionTitle';
import RankingPondium from './RankingPondium';
import NotificationArea from './notification-area/NotificationArea';
import { useProfile, useClientAdmin } from '../../../hooks/useRoleData';
import { clientAdminOp, userProfileOp } from '../../../utils/storage/lStorage';

const Title = ({ bizName }) => {
    return(
        <span className="text-subtitle font-weight-bold">
            Clientes da(o)
            <br />
            <span className="text-title">{bizName && bizName.cap()}</span>
        </span>
    );
};

export default function DashClients() {
    const { bizName } = useClientAdmin();
    const { userName } = useProfile();

    return (
        <div>
            <DashSectionTitle title={<Title bizName={bizName} />} />
            <NotificationArea userName={userName} />
            <hr />
            <RankingPondium />
            <hr />
            <ClientsHistory />
        </div>
    );
}
