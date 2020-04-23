import React from 'react';
import { useClientAdmin } from '../../hooks/useRoleData';
import {CLIENT_URL} from '../../config/clientUrl';
import ClientUserAppContent from './content/ClientUserAppContent';

const isSmall = window.Helper.isSmallScreen();

export default function ClientAppPreview() {
    const useProfile = () => ({
        _id: '123456',
        role: 'cliente',
        name: 'Nome Cliente',
    });

    const useClientUser = () => ({
        currScore: 100,
        lastScore: 20,
    });

    const showLogo = () => (
        <div className="container-center">
            <img
                className="animated zoomIn slow"
                style={{position: 'relative', margin: '15px 0', left: isSmall ? '5px' : '20px'}}
                src={CLIENT_URL + "/img/official-logo-name.png"}
                alt="Logomarca Principal"
                width={190}
                height="auto"
            />
        </div>
    );

    return (
        <div style={{overflowX: 'hidden', overflowY: 'auto', cursor: 'pointer'}}>
            {showLogo()}
            <ClientUserAppContent
                useProfile={useProfile}
                useClientUser={useClientUser}
                useClientAdmin={useClientAdmin}
                needAppForPreview={true}
            />
        </div>
    );
}