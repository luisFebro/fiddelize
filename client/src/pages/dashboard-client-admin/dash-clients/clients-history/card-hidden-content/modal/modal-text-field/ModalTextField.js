import React, { useState } from 'react';
import { useStoreDispatch } from 'easy-peasy';
import { readHighestScores } from '../../../../../../../redux/actions/userActions';
import isMoneyBrValidAndAlert from '../../../../../../../utils/numbers/isMoneyBrValidAndAlert';
import Button from '@material-ui/core/Button';
import ButtonMulti from '../../../../../../../components/buttons/material-ui/ButtonMulti';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import InstructionBtn from '../../../../../../../components/buttons/InstructionBtn';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import DialogTitle from '@material-ui/core/DialogTitle';
// import DialogContentText from '@material-ui/core/DialogContentText';
import parse from 'html-react-parser';
import PropTypes from 'prop-types';

// CUSTOMIZED DATA
import { modalTextFieldDashboardType } from '../../../../../../../types';
import { convertCommaToDot, convertDotToComma } from '../../../../../../../utils/numbers/convertDotComma';
import { updateUser } from '../../../../../../../redux/actions/userActions';
import { showSnackbar } from '../../../../../../../redux/actions/snackbarActions';
import animateCSS from '../../../../../../../utils/animateCSS';
import { fluidTextAlign } from '../../../../../../../utils/string/fluidTextAlign';
import scrollIntoView from '../../../../../../../utils/document/scrollIntoView';
import { readUserList } from '../../../../../../../redux/actions/userActions';
import { useAppSystem } from '../../../../../../../hooks/useRoleData';
// END CUSTOMIZED DATA

ModalTextField.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    modalData: modalTextFieldDashboardType,
};

export default function ModalTextField({
    open, onClose, modalData }) {
    const [data, setData] = useState({
        valueOnField: modalData.userCurrScore && modalData.userCurrScore.toString(),
        remainValue: '0,0',
    });
    const [gotError, setGotError] = useState(false);
    const [showInstruction, setShowInstruction] = useState(false);

    const { valueOnField, remainValue } = data;
    const { businessId } = useAppSystem();

    const dispatch = useStoreDispatch();

    const {
        title,
        subTitle,
        txtBtn,
        iconBtn,
        labelTxtField,
        userId,
        userCurrScore,
        rewardScore, } = modalData;

    const userBeatScore = userCurrScore >= rewardScore;

    const styles = {
        form: {
            margin: 'auto',
            width: '80%'
        },
        actionButtons: {
            display: 'flex',
            justifyContent: 'center',
            margin: '28px 0',
        },
        fieldFormValue: {
            backgroundColor: 'var(--mainWhite)',
            color: 'var(--themeP)',
            fontSize: '36px',
            fontFamily: 'var(--mainFont)',
            padding: '0 5px',
            zIndex: 2000
        },
    }

    const handleSubmit = () => {
        if(parseFloat(remainValue) < 0){
            showSnackbar(dispatch, "O valor do desconto é maior que o total de pontos do cliente. Digite valor menor", "error", 7000);
            setGotError(true); return;
        }

        if(!isMoneyBrValidAndAlert(valueOnField, showSnackbar, dispatch)) {
            setGotError(true); return;
        }

        const bodyToSend = {
            "clientUserData.currScore": parseFloat(remainValue),
        }

        updateUser(dispatch, bodyToSend, userId, false)
        .then(res => {
            if(res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error')
            onClose();
            const initialSkip = 0;
            readUserList(dispatch, initialSkip, "cliente", "", businessId)
            showSnackbar(dispatch, `Os pontos de fidelidade do cliente foram descontados com sucesso`, 'success', 8000)
            setTimeout(() => readHighestScores(dispatch, businessId), 3000);
        })
    };

    const handleChange = (setObj, obj) => e => {
        const { name, value } = e.target;
        let remainingValue = parseFloat(userCurrScore - convertCommaToDot(value))
        setObj({ valueOnField: value, remainValue: convertCommaToDot(remainingValue).toString() });
    }

    const showTitle = () => (
        <div className="mt-4 mb-3 margin-auto-90 text-center">
            <p
                id="form-dialog-title"
                className="text-subtitle text-purple font-weight-bold"
            >
                {title && parse(title)}
            </p>
        </div>
    );

    const showSubtitleAndInfos = () => (
        <div className="margin-auto-90 text-center">
            <p
                className={`${userBeatScore ? "text-sys-green" : 'text-grey'} text-normal font-weight-bold mt-2`}
            >
                {subTitle && parse(subTitle)}
            </p>
            <p className="text-normal text-purple text-center my-4">
                • Pontuação Atual do Cliente:<br/>
                <strong>{userCurrScore} Pontos</strong>
            </p>
        </div>
    );

    const showForm = () => (
        <form
            style={styles.form}
            onBlur={() => setGotError(false)}
            className="text-p text-normal"
        >
            <div>
                {parse(labelTxtField)}
                <TextField
                    type="text"
                    fullWidth
                    name="valueOnField"
                    value={valueOnField}
                    InputProps={{
                        style: styles.fieldFormValue,
                    }}
                    error={gotError ? true : false}
                    variant="outlined"
                    autoComplete="off"
                    onChange={handleChange(setData, data)}
                />
            </div>
        </form>
    );

    const showActionButtons = () => (
        <section style={styles.actionButtons}>
            <ButtonMulti
                title={"Voltar"}
                onClick={onClose}
                variant="link"
            />
            <ButtonMulti
                title={txtBtn}
                onClick={handleSubmit}
                iconFontAwesome={iconBtn}
                backgroundColor="var(--themeP)"
                backColorOnHover="var(--themeP)"
            />
        </section>
    );

    const showResultScoreAndWarning = () => (
        <section className="my-2">
            <div className="text-normal text-purple text-center">
                {!Number.isNaN(parseFloat(valueOnField)) && valueOnField !== "0,0"
                ? <div>
                    • App do cliente fica:
                    <br />
                    <p className="text-subtitle d-inline-block">
                        <span>
                            {parseInt(remainValue) === 0 ? "0" : convertDotToComma(remainValue)} Pontos.
                        </span>
                        <span className="ml-3">
                            <InstructionBtn
                                iconFontAwesome={<FontAwesomeIcon icon="question-circle" />}
                                onClick={() => { setShowInstruction(!showInstruction); scrollIntoView("#instru", 3000); }}
                            />
                        </span>
                    </p>
                </div>
                : null}
            </div>
            {showInstruction && (
                <p id="instru" className={`${fluidTextAlign} text-normal d-flex align-self-center`} style={{color: 'grey', maxWidth: '400px'}}>
                    - Valores do histórico de compra
                    do cliente e Pontos acumulados não são zerados ou descontados porque
                    ficam como registro. Apenas os pontos do desafio atual.
                </p>
            )}
        </section>
    );

    const showPartialDiscountBtn = () => (
        <section
            className={`d-block my-3 d-flex flex-column-reverse flex-md-row justify-content-center`}
        >
            <ButtonMulti
                title={"Voltar"}
                onClick={onClose}
                variant="link"
            />
        </section>
    );

    const showNoScoreDialog = () => (
        <section className="mt-5 my-3 px-5">
            <p className="text-subtitle text-center text-purple">
                Esse cliente ainda<br /><strong>não possui pontuação.</strong>
            </p>
            <div className="container-center">
                <ButtonMulti
                    title={"Voltar"}
                    onClick={onClose}
                    backgroundColor="var(--themeP)"
                    backColorOnHover="var(--themeP)"
                />
            </div>
        </section>
    );

    const showNotReachedYetDialog = () => (
        <section className="container-center">
            {showSubtitleAndInfos()}
            {showPartialDiscountBtn()}
        </section>
    );

    const showSuccessDialog = () => (
        <section className="container-center">
            {showSubtitleAndInfos()}
            {showForm()}
            {showResultScoreAndWarning()}
            {showActionButtons()}
        </section>
    );

    return (
        <Dialog
            PaperProps={{ style: {backgroundColor: 'var(--mainWhite)', maxWidth: '450px'}}}
            maxWidth="md"
            open={open}
            aria-labelledby="form-dialog-title"
        >
            {showTitle()}
            {!userCurrScore
            ? showNoScoreDialog()
            : userBeatScore ? showSuccessDialog() : showNotReachedYetDialog()}
        </Dialog>
    );
}

/* ARCHIVES
const showContinueBtn = () => (
    <div
        className={`${!needContinue ? "d-block my-3" : "d-none"}`}
        onClick={e => animateCSS(e.currentTarget, "zoomOut", "slow", () => setContinue(true))}
    >
        <ButtonMulti
            title="Continuar"
            backgroundColor="var(--themeP)"
            backColorOnHover="var(--themeP)"
        />
    </div>
);
*/

/* COMMENTS
Lesson:
e.target: effects an specific element;
supposes the mouse clicks right on the <p> element, then this specific element receives the action
<div onClick={e => e.target}>
 <p>Text</p>
</div>

currentTarget: the event effects the current element, not its children.

Even if you click right on the <p/> element, the action goes to the <div> element anyway.
<div onClick={e => e.target}>
 <p>Text</p>
</div>
*/