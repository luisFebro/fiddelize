import React, { useState } from "react";
import ButtonMulti, {
    faStyle,
} from "../../../../components/buttons/material-ui/ButtonMulti";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../style.scss";
import { useRunComp } from "../../../../hooks/useRunComp";
import getId from "../../../../utils/getId";
//pickers
import PickLogo from "./PickLogo";
import AsyncPickRatingIcon from "./AsyncPickRatingIcon";
import AsyncPickTheming from "./AsyncPickTheming";
// end pickers
// import useCount from '../../../../hooks/useCount';
const id = getId();

export default function AppPickersHandler({
    bizId,
    bizCodeName,
    bizName,
    clientName,
    setLogoUrlPreview,
    theme,
    setTheme,
    setLocalData,
    rewardDesc,
    rewardScore,
}) {
    const { runName } = useRunComp();
    const [step, setStep] = useState({ currNumber: 1, nextTask: "(cores)" });
    const [nextDisabled, setNextDisabled] = useState(true);

    // useCount(); // RT 3 (OK)

    const { currNumber, nextTask } = step;

    const handleNextStep = (currNumber) => {
        switch (currNumber) {
            case 1:
                setStep({ currNumber: 2, nextTask: "(ícones)" });
                setNextDisabled(true);
                break;
            case 2:
                const colors = {
                    selfThemePColor: theme.colorP,
                    selfThemeSColor: theme.colorS,
                    selfThemeBackColor: theme.colorBack
                        ? theme.colorBack
                        : theme.colorP,
                };

                setLocalData({
                    type: "theming",
                    colors,
                });
                setStep({ currNumber: 3, nextTask: "" });
                break;
            case 3:
                const iconsData = {
                    selfMilestoneIcon: runName || "star",
                    rewardList: [
                        {
                            id,
                            icon: runName,
                            rewardScore: rewardScore,
                            rewardDesc: rewardDesc || "Sem Descrição",
                        },
                    ],
                };
                setLocalData({
                    type: "icon",
                    iconsData,
                });
                // window.location.href = `/baixe-app/${clientName}?negocio=${bizName}&id=${bizId}&admin=1`;
                break;
            default:
                console.log("Something went wrong with handleNextStep");
        }
    };

    const showStepIndicatorAndBtnAction = () => (
        <div className="step-indicator-btn">
            <p className="text-title text-white text-center">
                {step.currNumber}/3
            </p>
            <ButtonMulti
                onClick={() => handleNextStep(currNumber)}
                title={`Continuar ${nextTask}`}
                disabled={nextDisabled ? true : false}
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
        <div>
            {showStepIndicatorAndBtnAction()}
            <PickLogo
                step={currNumber}
                setNextDisabled={setNextDisabled}
                bizId={bizId}
                bizName={bizName}
                bizCodeName={bizCodeName}
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
    );
}

/* ARCHIVES
useEffect(() => {
    if(step.currNumber === 3) {
        console.log("running setRun goBotto,m")
        setRun(dispatch, "goBottomApp");
    }
}, [step])
*/
