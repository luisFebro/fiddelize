import React from 'react';
import ClientsHistory from './clients-history/ClientsHistory';
import DashSectionTitle from '../../DashSectionTitle';
import { useStoreState } from 'easy-peasy';
import RankingPondium from './RankingPondium';
import NotificationArea from './notification-area/NotificationArea';

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
    const { bizName, userName } = useStoreState(state => ({
        userName: state.userReducer.cases.currentUser.name,
        bizName: state.userReducer.cases.clientAdmin.clientAdminData.bizName,
    }))

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
