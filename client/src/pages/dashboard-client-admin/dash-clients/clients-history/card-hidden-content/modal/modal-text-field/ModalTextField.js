import React, { useState, useEffect } from 'react';
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
import useSendNotif from '../../../../../../../hooks/notification/useSendNotif';
import { modalTextFieldDashboardType } from '../../../../../../../types';
import { convertCommaToDot, convertDotToComma } from '../../../../../../../utils/numbers/convertDotComma';
import { updateUser } from '../../../../../../../redux/actions/userActions';
import { showSnackbar } from '../../../../../../../redux/actions/snackbarActions';
import animateCSS from '../../../../../../../utils/animateCSS';
import { fluidTextAlign } from '../../../../../../../utils/string/fluidTextAlign';
import scrollIntoView from '../../../../../../../utils/document/scrollIntoView';
import { useAppSystem, useClientAdmin } from '../../../../../../../hooks/useRoleData';
import pickCurrChallData from '../../../../../../../utils/biz/pickCurrChallData';
import { setRun } from '../../../../../../../redux/actions/globalActions';
import { changePrizeStatus } from '../../../../../../../redux/actions/userActions';
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
    const [runNotif, setRunNotif] = useState(false);

    const { valueOnField, remainValue } = data;
    const { businessId } = useAppSystem();
    const { rewardList, rewardDeadline } = useClientAdmin();

    const dispatch = useStoreDispatch();

    let {
        title,
        subTitle,
        txtBtn,
        iconBtn,
        labelTxtField,
        userId,
        userCurrScore,
        rewardScore,
        totalPrizes,
        totalActiveScore,
        name,
    } = modalData;

    const currChall = totalPrizes + 1;

    const pickedObj = pickCurrChallData(rewardList, totalPrizes);
    rewardScore = pickedObj.rewardScore;
    const mainReward = pickedObj.mainReward;

    const challNotifOptions = React.useCallback(() => ({
        subtype: "confirmedChall",
        trigger: runNotif,
        senderId: businessId,
        role: "cliente",
        content: `currChall:${currChall};prizeDeadline:${rewardDeadline};prizeDesc:${mainReward};prizeConfirmationDate:${new Date()};`,
    }), [runNotif, businessId])
    const notifSent = useSendNotif(userId, "challenge", challNotifOptions())


    const userBeatScore = userCurrScore >= rewardScore;
    useEffect(() => {
        if(userCurrScore >= rewardScore) {
            const leftValue = userCurrScore - rewardScore;
            setData({ ...data, remainValue: leftValue.toString() })
        }
    }, [userCurrScore, rewardScore])

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
        const bodyToSend = {
            "clientUserData.currScore": parseFloat(remainValue),
            "clientUserData.totalActiveScore": parseFloat(totalActiveScore - rewardScore), // the same as currScore, this is only used to differentiate from totalGeneralScore.
            // This is handled in the backend with changePrizeStatus
            // "clientUserData.totalPurchasePrize": totalPrizes + 1, // the same as currScore, this is only used to differentiate from totalGeneralScore.
        }

        showSnackbar(dispatch, `Atualizando pontuação...`, 'success', 5000)
        updateUser(dispatch, bodyToSend, userId, false)
        .then(res => {
            if(res.status !== 200) return showSnackbar(dispatch, res.data.msg, 'error')
            setRunNotif(true);
            showSnackbar(dispatch, `OK! Foi notificado e descontado ${rewardScore} pontos de ${name.cap()}...`, 'success', 5000)
            changePrizeStatus(userId, { statusType: "confirmed" })
            .then(res => {
                if(res.status !== 200) return console.log("Houve um problema ao trocar status do prêmio")
                setRun(dispatch, "registered");
                if(notifSent) {
                    setTimeout(() => readHighestScores(dispatch, businessId), 2000);
                    setTimeout(() => onClose(), 3900);
                }
            })
        })
    };

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
                {parse(
                    userBeatScore
                    ? `Esse cliente chegou lá!<br />${name.cap()} ATINGIU a meta de ${rewardScore} Pontos 🎉`
                    : `O cliente ${name.cap()} ainda NÃO ATINGIU a meta de ${rewardScore} Pontos ${!userBeatScore ? `do desafio n.º ${currChall}` : ""}`
                )}
            </p>
            <h2 className="my-2 text-center text-purple text-subtitle font-weight-bold">
                Resumo
            </h2>
            {userBeatScore && (
                <div className="text-left text-normal text-purple my-1">
                    <p className="m-0">
                       ✔ Desafio Atual:
                    </p>
                    <p><strong>• N.º {currChall}</strong></p>
                </div>
            )}
            <div className="text-left text-normal text-purple my-1">
                <p className="m-0">
                   ✔ Pontuação Atual:
                </p>
                <p><strong>• {userCurrScore} Pontos</strong></p>
            </div>
            {userBeatScore && (
                <div className="text-left text-normal text-purple my-1">
                    <p className="m-0">
                        ✔ Cliente fica com:
                    </p>
                    <p className="font-weight-bold">
                        • {convertDotToComma(remainValue)} Pontos Restantes
                    </p>
                </div>
            )}
        </div>
    );

    // const showForm = () => (
    //     <form
    //         style={styles.form}
    //         onBlur={() => setGotError(false)}
    //         className="text-p text-normal"
    //     >
    //         <div>
    //             {parse(labelTxtField)}
    //             <TextField
    //                 type="text"
    //                 fullWidth
    //                 name="valueOnField"
    //                 value={valueOnField}
    //                 InputProps={{
    //                     style: styles.fieldFormValue,
    //                 }}
    //                 error={gotError ? true : false}
    //                 variant="outlined"
    //                 autoComplete="off"
    //                 onChange={handleChange(setData, data)}
    //             />
    //         </div>
    //     </form>
    // );

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

    const showWarningBtn = () => (
        <section className="my-2">
            <div className="d-inline-block font-weight-bold">
                {/*<span>
                    {parseInt(remainValue) === 0 ? "0" : convertDotToComma(remainValue)} Pontos.
                </span>*/}
                <div className="ml-3">
                    <InstructionBtn
                        onClick={() => { setShowInstruction(!showInstruction); scrollIntoView("#instru", 3000); }}
                        needTooltip={false}
                    />
                </div>
            </div>
            {showInstruction && (
                <p id="instru" className={`${fluidTextAlign} text-normal d-flex align-self-center`} style={{color: 'grey', maxWidth: '400px'}}>
                    - Todos valores acima ficam registrados no histórico de compras do cliente.
                    <br />
                    - Os pontos restantes são registrado como o atual no fidelidômetro do app.
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
        <section className="mt-5 my-3 px-3">
            <p className="text-subtitle text-center text-purple">
                Esse cliente ainda <strong>não possui pontuação </strong>
                no seu <strong>{currChall}.° desafio</strong> atual.
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

    // {showForm()} is discntinued to simplify algorithm from history purchase.
    const showSuccessDialog = () => (
        <section className="container-center">
            {showSubtitleAndInfos()}
            {showWarningBtn()}
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