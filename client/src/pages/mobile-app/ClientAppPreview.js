import React, { Fragment } from 'react';
import { useClientAdmin } from '../../hooks/useRoleData';
import ClientUserAppContent from './content/ClientUserAppContent';
import { withRouter } from 'react-router-dom';
import getQueryByName from '../../utils/string/getQueryByName';
import imgLib, { ImgLoader } from '../../utils/storage/lForageStore';

const isSmall = window.Helper.isSmallScreen();

function ClientAppPreview({ location }) {
    const runName = getQueryByName("runName", location.search);
    const clientName = getQueryByName("clientName", location.search);
    let logoUrlPreview = getQueryByName("logoUrlPreview", location.search);
    const colorP = getQueryByName("colorP", location.search);
    const colorS = getQueryByName("colorS", location.search);
    const colorBack = getQueryByName("colorBack", location.search);
    let rewardScore = getQueryByName("rewardScore", location.search);
    let currScore = getQueryByName("currScore", location.search);

    const useProfile = () => ({
        role: 'cliente',
        name: `${clientName} (T)`,
    });

    const useClientUser = () => ({
        currScore: Number(currScore) || 100,
        lastScore: 20,
    });

    const logoSrc = logoUrlPreview || imgLib.app_fiddelize_logo;
    const isSquared = logoSrc && logoSrc.includes("h_100,w_100");
    const showLogo = () => (
        <div className="container-center">
            <ImgLoader
                className={`${logoUrlPreview ? "app_biz_logo" : "app_fiddelize_logo"} animated zoomIn slow`}
                style={{position: 'relative', margin: '15px 0', left: isSmall ? '5px' : '20px'}}
                src={logoSrc}
                alt="Logomarca Principal"
                width={isSquared ? 100 : 190}
                height={isSquared ? 100 : 85}
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
                rewardScoreTest={rewardScore}
                colorP={colorP}
                colorS={colorS}
                colorBack={colorBack}
            />
        </Fragment>
    );

    return (
        <div className={`theme-back--${colorBack || colorP}`} style={{overflowX: 'hidden', overflowY: 'auto', cursor: 'pointer'}}>
            {mainContent()}
        </div>
    );
}

export default React.memo(withRouter(ClientAppPreview));