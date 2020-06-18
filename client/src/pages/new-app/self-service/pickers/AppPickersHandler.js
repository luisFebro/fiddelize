import React, { useState } from 'react';
import ButtonMulti, {faStyle} from '../../../../components/buttons/material-ui/ButtonMulti';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../style.scss';
import { setRun } from '../../../../redux/actions/globalActions';
import { useStoreDispatch } from 'easy-peasy';
import { showSnackbar } from '../../../../redux/actions/snackbarActions';
import { updateUser } from '../../../../redux/actions/userActions';
import { useRunComp } from '../../../../hooks/useRunComp';
// import useCount from '../../../../hooks/useCount';
//pickers
import PickLogo from './PickLogo';
import AsyncPickRatingIcon from './AsyncPickRatingIcon';
import AsyncPickTheming from './AsyncPickTheming';

// end pickers

export default function AppPickersHandler({
    bizId,
    bizCodeName,
    bizName,
    clientName,
    isTest,
    setLogoUrlPreview,
    theme,
    setTheme,
    rewardDesc,
    rewardScore, }) {
    const { runName } = useRunComp();
    const [step, setStep] = useState({ currNumber: 2, nextTask: '(cores)' });
    const [nextDisabled, setNextDisabled] = useState(true);

    // useCount(); // RT 3 (OK)

    const { currNumber, nextTask } = step;
    const dispatch = useStoreDispatch();

    const handleNextStep = currNumber => {
        switch(currNumber) {
            case 1:
                setStep({ currNumber: 2, nextTask: '(ícones)' });
                setNextDisabled(true);
                break;
            case 2:
                const objToSend1 = {
                    "clientAdminData.selfThemePColor": theme.colorP,
                    "clientAdminData.selfThemeSColor": theme.colorS,
                    "clientAdminData.selfThemeBackColor": theme.colorBack ? theme.colorBack : theme.colorP,
                }
                showSnackbar(dispatch, "Salvando preferências de cores e continuando...");
                updateUser(dispatch, objToSend1, bizId)
                .then(res => {
                    if(res.status !== 200) return showSnackbar(dispatch, "Algo deu errado. Verifique sua conexão", 'error')
                    setStep({ currNumber: 3, nextTask: '' });
                })
                break;
            case 3:
                const objToSend2 = {
                    "clientAdminData.selfMilestoneIcon": runName || "star",
                    "clientAdminData.rewardList": [{ id: bizId, icon: runName, rewardScore: rewardScore, rewardDesc: rewardDesc || "Sem Descrição" }]
                }
                showSnackbar(dispatch, "Salvo. Finalizando a criação dos apps...");
                updateUser(dispatch, objToSend2, bizId)
                .then(res => {
                    if(res.status !== 200) return showSnackbar(dispatch, "Algo deu errado. Verifique sua conexão", 'error')
                    if(isTest) {
                        showSnackbar(dispatch, `Modo Teste: ${clientName}, você concluíu o app do self-service. Redirecionando para o ínicio.`, "warning", 8000);
                        setTimeout(() => window.location.href = "/", 7900);
                    } else {
                        window.location.href = `/baixe-app/${clientName}?negocio=${bizName}&id=${bizId}&admin=1`;
                    }
                })
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
                iconFontAwesome={<FontAwesomeIcon icon="angle-right" style={faStyle}/>}
                textTransform='uppercase'
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
                />
            )}
            {currNumber === 3 && (
                <AsyncPickRatingIcon
                    isTest={isTest}
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