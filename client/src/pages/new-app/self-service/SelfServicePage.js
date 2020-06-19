import React, { useState } from 'react';
import AppPreview from './AppPreview';
import AppPickersHandler from './pickers/AppPickersHandler';
import getQueryByName from '../../../utils/string/getQueryByName';
import getFirstName from '../../../utils/string/getFirstName';
import useDelay from '../../../hooks/useDelay';
import Spinner from '../../../components/loadingIndicators/Spinner';
// import useCount from '../../../hooks/useCount';
import './style.scss';
import lStorage from '../../../utils/storage/lStorage';

lStorage("removeItem", {collection: "clientAdmin", property: "selfMilestoneIcon"})

function SelfServicePage({ location, match }) {
    //useCount();// RT = 3
    const [logoUrlPreview, setLogoUrlPreview] = useState("");
    const [theme, setTheme] = useState({
        colorP: "default",
        colorS: "default",
        colorBack: "",
    })
    const { colorP, colorS, colorBack } = theme;

    const isPageReady = useDelay(2000);

    const bizId = match.params.bizId;
    const bizCodeName = match.params.bizCodeName; // for image naming
    const getBizName = getQueryByName("negocio", location.search); // this is optional for when it is in testing mode.
    const bizName = getBizName && getBizName.cap();
    // API
    let clientName = getQueryByName("nome-cliente", location.search).cap();
    let rewardScore = getQueryByName("ponto-premio", location.search);
    let rewardDesc = getQueryByName("premio-desc", location.search);
    let currScore = getQueryByName("ponto-atual", location.search);
    const isTest = location.search.includes("teste=1");
    if(typeof rewardScore === "object") { rewardScore = 500 } // if it is null
    if(typeof currScore === "object") { currScore = 100 }
    clientName = getFirstName(clientName);
    // END API

    const showTitle = () => (
        <div className="text-center text-white my-4">
            <p className="text-title">Self-Service</p>
        </div>
    );

    const showSpinner = () => (
        !isPageReady &&
        <Spinner
            marginY={600}
            size="large"
            logo="white"
        />
    );

    return (
        <div style={{overflow: 'hidden'}}>
            {showSpinner()}
            {showTitle()}
            <div className="main-self-service">
                <section className="picker-area">
                    <p className="title text-subtitle text-center text-white">
                        Personalize o App dos clientes
                    </p>
                    <AppPickersHandler
                        bizId={bizId}
                        bizCodeName={bizCodeName}
                        bizName={bizName}
                        clientName={clientName}
                        isTest={isTest}
                        setLogoUrlPreview={setLogoUrlPreview}
                        theme={theme}
                        setTheme={setTheme}
                        rewardScore={rewardScore}
                        rewardDesc={rewardDesc}
                    />
                </section>
                <AppPreview
                    clientName={clientName}
                    logoUrlPreview={logoUrlPreview}
                    colorP={colorP}
                    colorS={colorS}
                    colorBack={colorBack}
                    currScore={currScore}
                    rewardScore={rewardScore}
                />
            </div>
        </div>
    );
}

export default SelfServicePage;

/*

 */
