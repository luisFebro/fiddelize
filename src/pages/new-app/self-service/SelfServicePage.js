import { useState } from "react";
import AppPreview from "./AppPreview";
import AppPickersHandler from "./pickers/AppPickersHandler";
import getQueryByName from "../../../utils/string/getQueryByName";
import useDelay from "../../../hooks/useDelay";
import Spinner from "../../../components/loadingIndicators/Spinner";
import useData from "init";
import "./style.scss";
import { removeItems } from "init/lStorage";
import getVar, { setVars } from "init/var";
import useScrollUp from "../../../hooks/scroll/useScrollUp";
import { useNeedRedirectPage } from "../helpers/handleRedirectPages";

removeItems("bizData", ["milestoneIcon"]);

const setLocalData = async ({ type = "theming", colors, iconsData }) => {
    const priorAdminData = await getVar("clientAdminData", "pre_register");

    let newObj = { ...priorAdminData, ...colors };

    let stepObj = { doneSSTheming: true };
    if (type !== "theming") {
        newObj = { ...priorAdminData, ...iconsData };
        stepObj = { doneSSRatingIcon: true };
    }

    const newAdminData = newObj;

    return await setVars(
        {
            clientAdminData: newAdminData,
            stepObj,
        },
        "pre_register"
    );
};

function SelfServicePage({ location, history }) {
    // useCount();// RT = 3
    const [logoUrlPreview, setLogoUrlPreview] = useState("");
    const [theme, setTheme] = useState({
        colorP: "default",
        colorS: "default",
        colorBack: "",
    });
    const { colorP, colorS, colorBack } = theme;

    const isPageReady = useDelay(2000);

    useScrollUp();
    useNeedRedirectPage({ history, priorPageId: "doneRewardPlanner" });

    const [clientAdminData] = useData(["clientAdminData"], "pre_register");
    const { bizName, bizLinkName } = clientAdminData;
    // API
    const clientName = getQueryByName("nome-cliente", location.search);
    let rewardScore = getQueryByName("ponto-premio", location.search);
    const rewardDesc = getQueryByName("premio-desc", location.search);
    let currScore = getQueryByName("ponto-atual", location.search);
    if (typeof rewardScore === "object") {
        rewardScore = 500;
    } // if it is null
    if (typeof currScore === "object") {
        currScore = 100;
    }
    // END API

    const showTitle = () => (
        <div className="text-center text-white my-4">
            <p className="text-title">Novo App</p>
            <p className="text-white text-normal mx-3 mb-5">Hora de criar!</p>
        </div>
    );

    const showSpinner = () =>
        !isPageReady && <Spinner marginY={600} size="large" logo="white" />;

    return (
        <div style={{ overflow: "hidden" }}>
            {showSpinner()}
            {showTitle()}
            <div className="main-self-service">
                <section className="picker-area mx-3">
                    <p className="title text-subtitle text-center text-white">
                        App dos clientes da {!bizName ? "..." : bizName}
                    </p>
                    <AppPickersHandler
                        bizLinkName={bizLinkName}
                        bizName={bizName}
                        history={history}
                        clientName={clientName}
                        setLogoUrlPreview={setLogoUrlPreview}
                        theme={theme}
                        setLocalData={setLocalData}
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
