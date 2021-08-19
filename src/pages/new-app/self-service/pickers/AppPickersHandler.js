import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonMulti, {
    faStyle,
} from "components/buttons/material-ui/ButtonMulti";
import "../style.scss";
import useRun from "global-data/ui";
import { getVars } from "init/var";
// pickers
import PickLogo from "./PickLogo";
import AsyncPickRatingIcon from "./AsyncPickRatingIcon";
import AsyncPickTheming from "./AsyncPickTheming";
// end pickers
import AppPreview from "../AppPreview";
// import getId from "utils/getId";
// import useCount from 'hooks/useCount';
// const id = getId();

const isSmall = window.Helper.isSmallScreen();

export default function AppPickersHandler({
    bizId,
    bizLinkName,
    bizName,
    clientName,
    setLogoUrlPreview,
    theme,
    setTheme,
    setLocalData,
    prizeDesc,
    targetPoints,
    logoUrlPreview,
    colorP,
    colorS,
    colorBack,
    currPoints,
    selectedGame,
}) {
    const { runName } = useRun();
    const [step, setStep] = useState({ currNumber: 1, nextTask: "(cores)" });
    const [nextDisabled, setNextDisabled] = useState(true);
    const isTargetGame = selectedGame === "targetPrize";

    useEffect(() => {
        (async () => {
            const [doneSSLogo, doneSSTheming] = await getVars(
                ["doneSSLogo", "doneSSTheming"],
                "pre_register"
            );
            if (doneSSLogo) handleNextStep(1);
            if (doneSSTheming) handleNextStep(2);
        })();
    }, []);

    const { currNumber, nextTask } = step;

    function handleNextStep(currN) {
        switch (currN) {
            case 1:
                setStep({ currNumber: 2, nextTask: "(ícones)" });
                setNextDisabled(true);
                break;
            case 2:
                {
                    const colors = {
                        themePColor: theme.colorP,
                        themeSColor: theme.colorS,
                        themeBackColor: theme.colorBack
                            ? theme.colorBack
                            : theme.colorP,
                    };

                    setLocalData({
                        type: "theming",
                        colors,
                    }).then(() => {
                        // any other games should be redirect to admin register page.
                        if (!isTargetGame) {
                            window.location.href = `/${bizLinkName}/novo-clube/cadastro-admin`;
                            return null;
                        }

                        setStep({ currNumber: 3, nextTask: "" });
                        setNextDisabled(false);
                    });
                }
                break;
            // ONly applied after clicking, null while in step 3.
            case 3:
                {
                    const iconsData = {
                        milestoneIcon: runName || "star",
                    };
                    setLocalData({
                        type: "icon",
                        iconsData,
                    }).then(() => {
                        // need to be reloaded since the other fields are prevented to be opened somehow.
                        window.location.href = `/${bizLinkName}/novo-clube/cadastro-admin`;
                    });
                }
                break;
            default:
                console.log("Something went wrong with handleNextStep");
        }
    }

    const showStepIndicatorAndBtnAction = () => (
        <div className="step-indicator-btn">
            <p className="text-title text-white text-center">
                {step.currNumber}/{isTargetGame ? "3" : "2"}
            </p>
            <ButtonMulti
                onClick={() => handleNextStep(currNumber)}
                title={`Continuar ${
                    isTargetGame && nextTask === "ícones" ? nextTask : ""
                }`}
                disabled={!!nextDisabled}
                color="var(--mainWhite)"
                backgroundColor="var(--themeSDark)"
                backColorOnHover="var(--themeSDark)"
                iconFontAwesome={
                    <FontAwesomeIcon icon="angle-right" style={faStyle} />
                }
                textTransform="uppercase"
            />
        </div>
    );

    return (
        <section className="main-self-service">
            <div className="picker-area mx-3">
                {showStepIndicatorAndBtnAction()}
                <PickLogo
                    step={currNumber}
                    setNextDisabled={setNextDisabled}
                    bizId={bizId}
                    bizName={bizName}
                    bizLinkName={bizLinkName}
                    setLogoUrlPreview={setLogoUrlPreview}
                />
                {currNumber === 2 && (
                    <AsyncPickTheming
                        step={currNumber}
                        setNextDisabled={setNextDisabled}
                        theme={theme}
                        setTheme={setTheme}
                        setLocalData={setLocalData}
                    />
                )}
                {currNumber === 3 && (
                    <AsyncPickRatingIcon
                        step={currNumber}
                        setNextDisabled={setNextDisabled}
                    />
                )}
            </div>
            <AppPreview
                clientName={clientName}
                logoUrlPreview={logoUrlPreview}
                colorP={colorP}
                colorS={colorS}
                colorBack={colorBack}
                currPoints={currPoints}
                targetPoints={targetPoints}
                prizeDesc={prizeDesc}
                game={selectedGame}
            />
            {isSmall && (
                <div className="container-center">
                    <ButtonMulti
                        onClick={() => handleNextStep(currNumber)}
                        title={`Continuar ${
                            isTargetGame && nextTask === "ícones"
                                ? nextTask
                                : ""
                        }`}
                        disabled={!!nextDisabled}
                        color="var(--mainWhite)"
                        backgroundColor="var(--themeSDark)"
                        backColorOnHover="var(--themeSDark)"
                        iconFontAwesome={
                            <FontAwesomeIcon
                                icon="angle-right"
                                style={faStyle}
                            />
                        }
                        textTransform="uppercase"
                    />
                </div>
            )}
        </section>
    );
}

/* ARCHIVES

const iconsData = {
    milestoneIcon: runName || "star",
    challList: [
        {
            id,
            milestoneIcon: runName,
            targetPoints,
            prizeDesc: prizeDesc || "Sem Descrição",
        },
    ],
};

 */
