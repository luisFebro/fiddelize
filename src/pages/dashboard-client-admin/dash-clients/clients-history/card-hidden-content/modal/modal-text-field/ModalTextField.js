import { useState } from "react";
import { useStoreDispatch } from "easy-peasy";
import Dialog from "@material-ui/core/Dialog";

import parse from "html-react-parser";
import PropTypes from "prop-types";
import InstructionBtn from "../../../../../../../components/buttons/InstructionBtn";
import ButtonMulti from "../../../../../../../components/buttons/material-ui/ButtonMulti";
import {
    addAutomaticTask,
    updateUser,
    changePrizeStatus,
} from "../../../../../../../redux/actions/userActions";

// CUSTOMIZED DATA
import { modalTextFieldDashboardType } from "../../../../../../../types";
import { convertDotToComma } from "../../../../../../../utils/numbers/convertDotComma";

import { showSnackbar } from "../../../../../../../redux/actions/snackbarActions";
import { fluidTextAlign } from "../../../../../../../utils/string/fluidTextAlign";
import scrollIntoView from "../../../../../../../utils/document/scrollIntoView";
import {
    useAppSystem,
    useClientAdmin,
} from "../../../../../../../hooks/useRoleData";
import pickCurrChallData from "../../../../../../../utils/biz/pickCurrChallData";

import { sendNotification } from "../../../../../../../redux/actions/notificationActions";
import getFirstName from "../../../../../../../utils/string/getFirstName";
import { addDays, calendar } from "../../../../../../../utils/dates/dateFns";
import useAPI, { readPrizes } from "../../../../../../../hooks/api/useAPI";
import sendSMS from "../../../../../../../hooks/sms/sendSMS";
import useData from "../../../../../../../hooks/useData";
// END CUSTOMIZED DATA

ModalTextField.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    modalData: modalTextFieldDashboardType,
};

const getStyles = () => ({
    form: {
        margin: "auto",
        width: "80%",
    },
    actionButtons: {
        display: "flex",
        justifyContent: "center",
        margin: "28px 0",
    },
    fieldFormValue: {
        backgroundColor: "var(--mainWhite)",
        color: "var(--themeP)",
        fontSize: "36px",
        fontFamily: "var(--mainFont)",
        padding: "0 5px",
        zIndex: 2000,
    },
});

export default function ModalTextField({
    open,
    onClose,
    modalData,
    closeOtherModals,
}) {
    const [data, setData] = useState({
        valueOnField:
            modalData.userCurrScore && modalData.userCurrScore.toString(),
        remainValue: "0,0",
    });
    const [gotError, setGotError] = useState(false);
    const [showInstruction, setShowInstruction] = useState(false);
    const [trigger, setTrigger] = useState(false);

    const styles = getStyles();

    const { valueOnField, remainValue } = data;
    const { businessId } = useAppSystem();
    const { rewardList, rewardDeadline } = useClientAdmin();
    const [teamMemberName] = useData(["name"]);

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
        phone,
        prizeId,
        updatedBy,
    } = modalData;

    const currChall = totalPrizes + 1;

    const pickedObj = pickCurrChallData(rewardList, totalPrizes);
    rewardScore = pickedObj.rewardScore;
    const { mainReward } = pickedObj;

    const { data: updatedValues, loading } = useAPI({
        url: readPrizes(userId),
        params: { updatedValues: true, rewardScore },
        trigger: true,
    });
    const currRemainder = loading
        ? "..."
        : updatedValues
        ? updatedValues.remainder
        : 0;
    const nextScore = loading
        ? "..."
        : updatedValues
        ? updatedValues.nextScore
        : 0;
    const currUserScoring = loading
        ? "..."
        : updatedValues
        ? convertDotToComma(updatedValues.updatedCurrScore)
        : 0;
    const additionalScore = loading ? "..." : convertDotToComma(nextScore);
    const ultimateCurrScore = loading
        ? "..."
        : Number(currRemainder) + Number(nextScore); // before updatedValues.updatedCurrScore - rewardScore
    const userBeatScore = userCurrScore >= rewardScore;

    const handleDiscount = async () => {
        if (loading || teamMemberName === "...") return;

        const updateUserBody = {
            "clientUserData.currScore": ultimateCurrScore,
            "clientUserData.totalActiveScore": parseFloat(
                totalActiveScore - rewardScore
            ), // the same as currScore, this is only used to differentiate from totalGeneralScore.
            // This is handled in the backend with changePrizeStatus
            // "clientUserData.totalPurchasePrize": totalPrizes + 1, // the same as currScore, this is only used to differentiate from totalGeneralScore.
        };

        const sendNotifBody = {
            subtype: "confirmedChall",
            content: `currChall:${currChall};prizeDeadline:${rewardDeadline};prizeDesc:${mainReward};prizeConfirmationDate:${new Date()};`,
            role: "cliente",
            senderId: businessId,
        };

        const deadlineDate = addDays(
            new Date(),
            rewardDeadline + 1
        ).toLocaleString();

        const taskBody = {
            taskTitle: "Entrega de Prêmio",
            taskType: "pendingDelivery",
            content: `cliUserId:${userId};cliUserName:${name};prizeId:${prizeId};prizeDesc:${mainReward};challNum:${currChall};deadline:${deadlineDate};`,
            madeBy: teamMemberName,
        };

        showSnackbar(dispatch, "Atualizando pontuação...", "success", 5000);

        const prizeStatusRes = await changePrizeStatus(userId, {
            statusType: "confirmed",
            prizeId,
        });
        if (prizeStatusRes.status !== 200) {
            if (prizeStatusRes.data.error.indexOf("critical") !== -1)
                return showSnackbar(
                    dispatch,
                    "Não foi possível descontar pontos. Por favor, contate suporte técnico da Fiddelize.",
                    "error"
                );
            return showSnackbar(
                dispatch,
                "Pontos deste desafio já foram descontados e podem está desatualizados.",
                "error"
            );
        }
        const [updateRes, notifRes, taskRes, smsRes] = await Promise.all([
            updateUser(dispatch, updateUserBody, userId, {
                thisRole: "cliente",
            }),
            sendNotification(userId, "challenge", sendNotifBody),
            addAutomaticTask(businessId, taskBody),
            sendSMS({
                userId: businessId,
                smsId: prizeId,
                dispatch,
                contactList: [
                    { name: getFirstName(name, { addSurname: true }), phone },
                ],
            }),
        ]);

        if (notifRes.status !== 200)
            return showSnackbar(
                dispatch,
                "Um problema aconteceu ao enviar notificação para o cliente",
                "error"
            );
        if (updateRes.status !== 200)
            return showSnackbar(
                dispatch,
                "Algo deu errado ao atualizar cliente",
                "error"
            );
        if (taskRes.status !== 200)
            return showSnackbar(
                dispatch,
                "Ocorreu um problema ao adicionar tarefa automática.",
                "error"
            );
        if (smsRes.status !== 200)
            console.log("An error happened when sending SMS");

        setTimeout(
            () =>
                showSnackbar(
                    dispatch,
                    `Ok! Cliente ${
                        name && name.toUpperCase()
                    } foi notificado(a) e está apto(a) a receber o prêmio.`,
                    "success",
                    10000
                ),
            2900
        );

        closeOtherModals(); // use to close other open notification pages.
        setTimeout(() => onClose(), 3900);
    };

    const handleSubmit = () => {
        setTrigger(true);
        handleDiscount();
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

    const displayMoreRemainder = Boolean(nextScore);
    const showSubtitleAndInfos = () => (
        <div className="margin-auto-90 text-center">
            <p
                className={`${
                    userBeatScore ? "text-sys-green" : "text-grey"
                } text-normal font-weight-bold mt-2`}
            >
                {parse(
                    userBeatScore
                        ? `Esse cliente chegou lá!<br />${name} ATINGIU a meta de ${rewardScore} Pontos 🎉`
                        : `O cliente ${name} ainda NÃO ATINGIU a meta de ${rewardScore} Pontos ${
                              !userBeatScore
                                  ? `do desafio n.º ${currChall}`
                                  : ""
                          }`
                )}
            </p>
            <h2 className="my-2 text-center text-purple text-subtitle font-weight-bold">
                Resumo
            </h2>
            {userBeatScore && (
                <div className="text-left text-normal text-purple my-1">
                    <p className="m-0">✔ Desafio Concluído:</p>
                    <p>
                        <strong>• N.º {currChall}</strong>
                    </p>
                </div>
            )}
            <div className="text-left text-normal text-purple my-1">
                <p className="m-0">✔ Pontuação Atual:</p>
                <p>
                    <strong>• {currUserScoring} Pontos</strong>
                </p>
            </div>
            {userBeatScore && (
                <div className="text-left text-normal text-purple my-1">
                    <p className="m-0">✔ Cliente fica com:</p>
                    <p
                        className={`font-weight-bold text-nowrap ${
                            displayMoreRemainder ? "text-blue" : ""
                        }`}
                    >
                        • {convertDotToComma(ultimateCurrScore)} Pontos
                        Restantes
                        {displayMoreRemainder && (
                            <span className="text-blue text-small font-weight-bold d-block">
                                <br />
                                <span
                                    className="d-block"
                                    style={{
                                        fontSize: "18px",
                                        lineHeight: "23px",
                                    }}
                                >
                                    &#187;{" "}
                                    {loading
                                        ? "..."
                                        : convertDotToComma(currRemainder)}{" "}
                                    pontos
                                </span>{" "}
                                que sobraram do desafio atual
                                <br />
                                <br />
                                <span
                                    className="d-block"
                                    style={{
                                        fontSize: "18px",
                                        lineHeight: "23px",
                                    }}
                                >
                                    + {loading ? "..." : additionalScore} pontos
                                    adicionais
                                    <br />
                                    <span className="text-small font-weight-bold">
                                        (feitos enquanto desafio não
                                        <br />
                                        estava confirmado.)
                                    </span>
                                </span>
                            </span>
                        )}
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

    const showWarningBtn = () => (
        <section className="my-2">
            <div className="d-inline-block font-weight-bold">
                {/* <span>
                    {parseInt(remainValue) === 0 ? "0" : convertDotToComma(remainValue)} Pontos.
                </span> */}
                <div className="ml-3">
                    <InstructionBtn
                        onClick={() => {
                            setShowInstruction(!showInstruction);
                            scrollIntoView("#instru", { delay: 2000 });
                        }}
                    />
                </div>
            </div>
            {showInstruction && (
                <p
                    id="instru"
                    className={`${fluidTextAlign} text-normal d-flex align-self-center`}
                    style={{ color: "grey", maxWidth: "400px" }}
                >
                    - Todos valores acima ficam registrados no histórico de
                    compras do cliente.
                    <br />- Os pontos restantes são registrado como o atual no
                    fidelidômetro do app.
                    <br />- Após descontar a pontuação, o cliente fica apto a
                    receber o prêmio. Você controla a entrega de prêmios no app
                    da equipe na opção de ganhadores ou no app do admin na
                    sessão clientes ganhadores.
                </p>
            )}
        </section>
    );

    const showPartialDiscountBtn = () => (
        <section className="d-block my-3 d-flex flex-column-reverse flex-md-row justify-content-center">
            <ButtonMulti title="Voltar" onClick={onClose} variant="link" />
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
                    title="Voltar"
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

    const alreadyDoneDiscount =
        updatedBy &&
        updatedBy.name &&
        updatedValues &&
        updatedValues.updatedCurrScore === 0;

    const showActionButtons = () => (
        <section style={styles.actionButtons}>
            <ButtonMulti title="Voltar" onClick={onClose} variant="link" />
            {!alreadyDoneDiscount && (
                <ButtonMulti
                    title={txtBtn}
                    onClick={handleSubmit}
                    iconFontAwesome={iconBtn}
                    backgroundColor="var(--themeP)"
                    backColorOnHover="var(--themeP)"
                />
            )}
        </section>
    );

    const showSuccessDialog = () => (
        <section className="container-center">
            {showSubtitleAndInfos()}
            {showWarningBtn()}
            {alreadyDoneDiscount && (
                <p className="my-4 text-normal text-center text-purple font-weight-bold mx-3">
                    Atenção: Pontos já descontados pelo membro{" "}
                    {updatedBy.name.toUpperCase()} no dia:{" "}
                    {calendar(new Date(updatedBy.updatedAt))}.
                </p>
            )}
            {showActionButtons()}
        </section>
    );

    return (
        <Dialog
            PaperProps={{
                style: {
                    backgroundColor: "var(--mainWhite)",
                    maxWidth: "450px",
                },
            }}
            style={{ zIndex: 10000 }}
            maxWidth="md"
            open={open}
            aria-labelledby="form-dialog-title"
        >
            {showTitle()}
            {!userCurrScore
                ? showNoScoreDialog()
                : userBeatScore
                ? showSuccessDialog()
                : showNotReachedYetDialog()}
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
