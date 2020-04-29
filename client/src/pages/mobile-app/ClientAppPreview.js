import React, { Fragment } from 'react';
import { useClientAdmin } from '../../hooks/useRoleData';
import {CLIENT_URL} from '../../config/clientUrl';
import ClientUserAppContent from './content/ClientUserAppContent';
import { withRouter } from 'react-router-dom';
import getQueryByName from '../../utils/string/getQueryByName';
const isSmall = window.Helper.isSmallScreen();

function ClientAppPreview({ location }) {
    const runName = getQueryByName("runName", location.search);
    const clientName = getQueryByName("clientName", location.search);

    const useProfile = () => ({
        _id: '123456',
        role: 'cliente',
        name: 'Nome Cliente',
    });

    const useClientUser = () => ({
        currScore: 110,
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

    const mainContent = () => (
        <Fragment>
            {showLogo()}
            <ClientUserAppContent
                useProfile={useProfile}
                useClientUser={useClientUser}
                useClientAdmin={useClientAdmin}
                needAppForPreview={true}
                runName={runName}
                cliAdminName={clientName}
            />
        </Fragment>
    );

    return (
        <div style={{overflowX: 'hidden', overflowY: 'auto', cursor: 'pointer'}}>
            {mainContent()}
        </div>
    );
}

export default withRouter(ClientAppPreview);