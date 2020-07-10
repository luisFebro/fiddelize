import React, { useEffect, useState } from 'react';
import DashSectionTitle from '../../DashSectionTitle';
// COMPONENTS
import RankingPondium from './RankingPondium';
import AutomaticToDoList from './automatic-to-do-list';
import VAsyncRecordedClientsList from './clients-history/VAsyncRecordedClientsList';
// END COMPONENTS

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
            <VAsyncRecordedClientsList />
        </div>
    );
}
