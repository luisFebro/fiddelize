import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { convertDotToComma } from "utils/numbers/convertDotComma";
import { sendNotification, updateUser } from "api/frequent";
import getFirstName from "utils/string/getFirstName";
import { addDays, calendar } from "utils/dates/dateFns";
import useData, { useBizData } from "init";
import getAPI, { addTask, setNotifAuthor, changePrizeStatus } from "api";
import InstructionBtn from "../../../../buttons/InstructionBtn";
import ButtonFab from "../../../../buttons/material-ui/ButtonFab";
import showToast from "../../../../toasts";

export default function DiscountBenefit({ onClose, modalData }) {
    const [disableCTA, setDisableCTA] = useState(false);

    const { bizId, bizLogo, bizName, rewardDeadline = 30 } = useBizData();
    const [staffName, role, firstStaffName] = useData([
        "name",
        "role",
        "firstName",
    ]);

    const {
        senderId: customerId,
        cardId,
        totalPrizes,
        userCurrScore,
        targetPoints,
        name,
        prizeId,
        updatedBy,
        prizeDesc,
        gender,
    } = modalData;

    const currChall = totalPrizes + 1;

    const currCustomerScore = Number(userCurrScore);
    const leftCustomerScore = Number(userCurrScore) - Number(targetPoints);

    const handleDiscount = async () => {
        if (staffName === "...") return false;
        setDisableCTA(true);

        const updateUserBody = {
            "clientUserData.needStaffDiscount": false,
            "clientUserData.currPoints": leftCustomerScore,
            "clientUserData.games.targetPrize.challN": currChall + 1,
        };

        const notifAuthorBody = {
            role: "cliente-admin",
            cliAdminId: bizId,
            cardId,
            updatedBy: {
                role,
                name: staffName,
                updatedAt: new Date(),
            },
        };

        const pushNotifData = {
            isPushNotif: true,
            type: "confirmedChall",
            userId: customerId,
            role: "cliente",
            payload: {
                customerName: getFirstName(name && name.cap()),
                bizName,
                currChall,
                bizLogo,
            },
            notifCard: {
                cardType: "challenge",
                subtype: "confirmedChall",
                currChall,
                prizeDeadline: rewardDeadline,
                prizeDesc,
                // senderId: bizId,
            },
        };

        const deadlineDate = addDays(
            new Date(),
            rewardDeadline + 1
        ).toLocaleString();

        const taskBody = {
            taskTitle: "Entrega de Prêmio",
            taskType: "pendingDelivery",
            content: `cliUserId:${customerId};cliUserName:${name};prizeId:${prizeId};prizeDesc:${prizeDesc};challNum:${currChall};deadline:${deadlineDate};`,
            madeBy: staffName,
        };

        showToast("Atualizando pontuação do cliente...");

        const params = {
            prizeId,
            newValue: true,
        };

        const prizeStatusRes = await getAPI({
            method: "put",
            url: changePrizeStatus(customerId, "confirmed"),
            params,
        }).catch((err) => {
            if (err.indexOf("critical") !== -1) {
                showToast(
                    "Não foi possível descontar pontos. Por favor, contate suporte técnico da Fiddelize.",
                    { type: "error", dur: 15000 }
                );
            }

            showToast(
                "Pontos deste desafio já foram descontados e podem está desatualizados.",
                { type: "error", dur: 9000 }
            );
        });
        if (!prizeStatusRes) return null;

        const [updateRes, notifRes, taskRes] = await Promise.all([
            updateUser(customerId, "cliente", updateUserBody),
            sendNotification(customerId, "challenge", pushNotifData),
            getAPI({
                method: "put",
                url: addTask(),
                body: taskBody,
                fullCatch: true,
            }),
            getAPI({
                method: "post",
                url: setNotifAuthor(),
                body: notifAuthorBody,
                fullCatch: true,
            }),
        ]);

        if (!notifRes)
            return showToast(
                "Um problema aconteceu ao enviar notificação para o cliente",
                { type: "error" }
            );
        if (!updateRes)
            return showToast("Algo deu errado ao atualizar cliente", {
                type: "error",
            });
        if (!taskRes)
            return showToast(
                "Ocorreu um problema ao adicionar tarefa automática.",
                { type: "error" }
            );

        showToast(
            `Pontos descontados, ${firstStaffName}! ${gender.toUpperCase()} cliente ${
                name && name.toUpperCase()
            } foi notificad${gender} e está apt${gender} a receber o prêmio. (${prizeDesc})`,
            { type: "success", dur: 15000 }
        );

        setTimeout(() => {
            onClose();
        }, 2500);

        return false;
    };

    const instruTxt =
        "A pontuação atual é descontada e zerada no app do cliente, iniciando um novo desafio. Mas o valor fica registrado no histórico de compras do cliente para consulta.";

    const showIntruBtn = () => (
        <span className="d-inline-block ml-3">
            <InstructionBtn text={instruTxt} mode="tooltip" animated={false} />
        </span>
    );

    const showBriefAndCTA = () => (
        <section className="margin-auto-90 text-center">
            <h2 className="my-2 text-center text-purple text-subtitle font-weight-bold">
                Resumo
            </h2>
            <div className="text-left text-normal text-purple my-1">
                <p className="m-0">✔ Desafio Concluído:</p>
                <p>
                    <strong>
                        • N.º {currChall} ({targetPoints} pontos)
                    </strong>
                </p>
            </div>
            <div className="text-left text-normal text-purple my-1">
                <p className="m-0">
                    ✔ Pontuação Atual:
                    {showIntruBtn()}
                </p>
                <p>
                    <strong>
                        • {convertDotToComma(currCustomerScore)} Pontos
                    </strong>
                </p>
            </div>
            <div className="text-left text-normal text-purple my-1">
                <p className="m-0">✔ Cliente fica com:</p>
                <p className="font-weight-bold text-nowrap">
                    • {convertDotToComma(leftCustomerScore)} Pontos Restantes
                </p>
            </div>
            <section className="container-center my-5">
                <ButtonFab
                    disabled={disableCTA}
                    title="Descontar Pontos"
                    onClick={handleDiscount}
                    iconFontAwesome={<FontAwesomeIcon icon="minus-circle" />}
                    backgroundColor="var(--themeSDark)"
                    variant="extended"
                    position="relative"
                    size="large"
                />
            </section>
        </section>
    );

    const alreadyDoneDiscount = Boolean(updatedBy && updatedBy.name);

    const showAlreadyDone = () => (
        <section
            className="container-center"
            style={{
                margin: "20px 0 50px",
            }}
        >
            <div className="my-2 container-center">
                <FontAwesomeIcon
                    icon="check-circle"
                    style={{
                        fontSize: 50,
                        color: "var(--themePDark)",
                    }}
                />
            </div>
            <p className="text-normal text-center text-purple font-weight-bold mx-3">
                Pontos do cliente já foram descontados
                {updatedBy.role === "cliente-admin" ? (
                    <span>
                        {" "}
                        por <span className="text-pill">você</span>
                    </span>
                ) : (
                    <span>
                        {" "}
                        pelo membro{" "}
                        <span className="text-pill">
                            {updatedBy.name.toUpperCase()}
                        </span>
                    </span>
                )}{" "}
                em: {calendar(new Date(updatedBy.updatedAt))}.
            </p>
        </section>
    );

    return (
        <section>
            {!alreadyDoneDiscount ? showBriefAndCTA() : showAlreadyDone()}
        </section>
    );
}

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

/* ARCHIVES
const showNoScoreDialog = () => (
    <section className="mt-5 my-3 px-3">
        <p className="text-subtitle text-center text-purple">
            Esse cliente ainda <strong>não possui pontuação </strong>
            no seu <strong>{currChall}.° desafio</strong> atual.
        </p>
    </section>
);

const [data, setData] = useState({
        valueOnField:
            modalData.userCurrScore && modalData.userCurrScore.toString(),
        remainValue: "0,0",
    });


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
 */
