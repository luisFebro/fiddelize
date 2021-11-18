import { useState, useEffect } from "react";
import getQueryByName from "utils/string/getQueryByName";
import useDelay from "hooks/useDelay";
import Spinner from "components/loadingIndicators/Spinner";
import useData from "init";
import { removeItems } from "init/lStorage";
import getVar, { setVars } from "init/var";
import useScrollUp from "hooks/scroll/useScrollUp";
import "./style.scss";
import { useNeedRedirectPage } from "../helpers/handleRedirectPages";
import AppPickersHandler from "./pickers/AppPickersHandler";

const isSmall = window.Helper.isSmallScreen();

removeItems("bizData", ["milestoneIcon"]);

const setLocalData = async ({ type = "theming", colors, iconsData }) => {
    const priorAdminData = await getVar("clientAdminData", "pre_register");
    // only targetPrize game will get here since the discountBack is redirected right to the final register page
    const priorGame = priorAdminData && priorAdminData.games.targetPrize;

    let newObj = { ...priorAdminData, ...colors };

    let stepObj = { doneSSTheming: true };
    if (type === "icon") {
        newObj = {
            ...priorAdminData,
            games: {
                targetPrize: {
                    ...priorGame,
                    challList: [
                        {
                            ...priorGame.challList[0],
                            milestoneIcon: iconsData.milestoneIcon,
                        },
                    ],
                },
            },
        };
        stepObj = { doneSSRatingIcon: true };
    }

    const newAdminData = newObj;

    return await setVars(
        {
            clientAdminData: newAdminData,
            ...stepObj,
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

    useEffect(() => {
        (async () => {
            // check for prior data and use them if user reload the page
            const priorAdminData = await getVar(
                "clientAdminData",
                "pre_register"
            );
            const priorLogo = priorAdminData && priorAdminData.bizLogo;
            if (priorLogo) setLogoUrlPreview(priorLogo || "");
        })();
    }, []);

    useScrollUp();
    useNeedRedirectPage({ history, priorPageId: "doneBizInfo" });

    const [clientAdminData] = useData(["clientAdminData"], "pre_register");
    const { bizName, bizLinkName } = clientAdminData;
    // API
    const selectedGame = getQueryByName("g", location.search);
    const clientName = getQueryByName("nome-cliente", location.search);
    let targetPoints = getQueryByName("ponto-premio", location.search);
    const prizeDesc = getQueryByName("premio-desc", location.search);
    let currPoints = getQueryByName("ponto-atual", location.search);
    if (typeof targetPoints === "object") {
        targetPoints = 500;
    } // if it is null
    if (typeof currPoints === "object") {
        currPoints = 100;
    }
    // END API

    const showTitle = () => (
        <div className="text-center text-white my-4">
            <p className="text-title">Novo Clube</p>
            <p className="text-white text-normal mx-3 mb-5">
                {isSmall
                    ? "Personalize apps do clube com o estilo do seu negócio!"
                    : "Personalize apps do seu clube"}
            </p>
        </div>
    );

    const showSpinner = () =>
        !isPageReady && <Spinner marginY={600} size="large" logo="white" />;

    return (
        <div style={{ overflow: "hidden" }}>
            {showSpinner()}
            {showTitle()}
            <AppPickersHandler
                selectedGame={selectedGame}
                bizLinkName={bizLinkName}
                bizName={bizName}
                history={history}
                clientName={clientName}
                setLogoUrlPreview={setLogoUrlPreview}
                theme={theme}
                setLocalData={setLocalData}
                setTheme={setTheme}
                targetPoints={targetPoints}
                prizeDesc={prizeDesc}
                logoUrlPreview={logoUrlPreview}
                colorP={colorP}
                colorS={colorS}
                colorBack={colorBack}
                currPoints={currPoints}
            />
        </div>
    );
}

export default SelfServicePage;

/*
<p className="title text-subtitle text-center text-white">
    App dos clientes da {!bizName ? "..." : bizName}
</p>
 */
