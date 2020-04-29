import React, { useState } from 'react';
import ButtonMulti, {faStyle} from '../../../../components/buttons/material-ui/ButtonMulti';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../style.scss';
import { setRun } from '../../../../redux/actions/globalActions';
import { useStoreDispatch } from 'easy-peasy';
import { showSnackbar } from '../../../../redux/actions/snackbarActions';
//pickers
import PickTheming from './PickTheming';
import PickLogo from './PickLogo';
import PickRatingIcon from './PickRatingIcon';
// end pickers

export default function AppPickersHandler({
    bizId, bizName, clientName, isTest }) {
    const [step, setStep] = useState({ currNumber: 1, nextTask: '(cores)' });
    const [nextDisabled, setNextDisabled] = useState(true);

    const { currNumber, nextTask } = step;
    const dispatch = useStoreDispatch();

    const handleNextStep = currNumber => {
        switch(currNumber) {
            case 1:
                setStep({ currNumber: 2, nextTask: '(ícones)' });
                setNextDisabled(true);
                break;
            case 2:
                setStep({ currNumber: 3, nextTask: '' });
                break;
            case 3:
                if(isTest) {
                    showSnackbar(dispatch, `Modo Teste: ${clientName}, você concluíu o app do self-service. Redirecionando para o ínicio.`, "warning", 8000);
                    setTimeout(() => window.location.href = "/", 7900);
                } else {
                    window.location.href = `/baixe-app/${clientName}?negocio=${bizName}&id=${bizId}&admin=1`;
                }
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
            <PickLogo step={currNumber} setNextDisabled={setNextDisabled} />
            <PickTheming step={currNumber} setNextDisabled={setNextDisabled} />
            <PickRatingIcon step={currNumber} setNextDisabled={setNextDisabled} />
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