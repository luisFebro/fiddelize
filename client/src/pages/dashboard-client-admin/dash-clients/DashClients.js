import React, { useEffect, useState } from 'react';
import VAsyncRecordedClientsList from './clients-history/VAsyncRecordedClientsList';
import DashSectionTitle from '../../DashSectionTitle';
import RankingPondium from './RankingPondium';
// import useDidScroll from '../../../hooks/scroll/useDidScroll';
// NotificationArea will be embed into the full modal of notification...
// import NotificationArea from './notification-area/NotificationArea';
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
    // need to fix teh fact that it is disabling window.scroll = null
    // and causing the show more buttons to not appear.
    // const didScroll = useDidScroll();
    const [preload, setPreload] = useState(false);

    useEffect(() => {
        const thisTimeout = setTimeout(() => setPreload(true), 3000);
        if(preload) {
            VAsyncRecordedClientsList.preload();
        }
        return () => { clearTimeout(thisTimeout) };
    }, [preload])

    const { bizName } = useClientAdmin();
    const { name } = useProfile();

    return (
        <div>
            <DashSectionTitle
                title={<Title bizName={bizName} />}
            />
            <RankingPondium />
            <hr />
            <VAsyncRecordedClientsList />
        </div>
    );
}
