import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { convertDotToComma } from "utils/numbers/convertDotComma";
import useData from "init";
import getAPI, { changeBenefit } from "api";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import showToast from "components/toasts";
import { gameIconsStore } from "components/biz/GamesBadge";
import getFirstName from "utils/string/getFirstName";
import FaqPoints from "./FaqPoints";
// import scrollIntoView from "utils/document/scrollIntoView";

export default function DiscountBenefit(props) {
    const [disableCTA, setDisableCTA] = useState(false);

    const { onClose, gameName } = props;

    const {
        customerId = "1233213",
        customerName = "Luis Febro Bruno Feitoza",
        _id: benefitId = "1234",
        currChall = 5,
        currPoints = 150,
        targetPoints = 100,
        benefitDesc = "ticket de ingresso",
        gender = "Ele",
    } = props;
    const name = getFirstName(customerName, { addSurname: true });

    const {
        userId: staffId,
        name: staffName,
        role,
        firstName: firstStaffName,
    } = useData();

    const currCustomerPoints = Number(currPoints);
    const leftCustomerPoints = Number(currPoints) - Number(targetPoints);

    const handleDiscount = async () => {
        setDisableCTA(true);

        const benefitBody = {
            customerId,
            benefitId,
            isReceived: true,
            newPoints: leftCustomerPoints,
            gameName,
            currChall,
            staff: {
                id: staffId,
                role,
                name: staffName,
                updatedAt: new Date(),
            },
        };

        showToast("Aplicando benefício...");

        getAPI({
            method: "put",
            url: changeBenefit(),
            body: benefitBody,
            params: { userId: staffId }, // for token verify
        });

        showToast(
            `Benefício registrado sucesso, ${firstStaffName}! Agora ${gender.toUpperCase()} cliente ${
                name && name.toUpperCase()
            } já pode receber o benefício. (${benefitDesc})`,
            { type: "success", dur: 15000 }
        );

        setTimeout(() => {
            onClose();
        }, 2500);

        return false;
    };

    const showBriefAndCTA = () => (
        <section className="margin-auto-90 text-center">
            <h2 className="mt-2 mb-4 text-center text-purple text-subtitle font-weight-bold">
                Recebimento de
                <br />
                Benefício pelo cliente
            </h2>
            <div className="all-game-info text-left text-normal text-white text-shadow mt-3 mb-1 text-center">
                <p className="pt-1 m-0 font-weight-bold">
                    Jogo de compra concluído
                </p>
                <div className="discount-benefit-game-title container-center">
                    {gameIconsStore[gameName]}
                    <p className="m-0 pb-2 text-left font-weight-bold">
                        <span className="font-weight-normal">
                            {getGameName(gameName)}
                        </span>
                        <br />
                        <span className="font-weight-normal">
                            Desafio:
                        </span> N.º {currChall}
                        <br />
                        <span className="font-weight-normal">Meta:</span>{" "}
                        {targetPoints} pts
                    </p>
                </div>
            </div>
            <div className="mt-4 text-left text-normal text-purple">
                <p className="m-0">✔ Saldo Atual do cliente:</p>
                <p>
                    <strong>
                        • {convertDotToComma(currCustomerPoints)} Pts
                    </strong>
                </p>
            </div>
            <div className="text-left text-normal text-purple my-1">
                <p className="m-0">✔ Cliente fica com:</p>
                <p className="font-weight-bold text-nowrap">
                    • {convertDotToComma(leftCustomerPoints)} Pts Restantes
                </p>
            </div>
            <p className="text-normal font-weight-bold mt-3 mx-3 m-0">
                Confirmar benefício e descontar pontos?
            </p>
            <section className="container-center mt-3 mb-5">
                <ButtonFab
                    disabled={disableCTA}
                    title="Aplicar"
                    onClick={handleDiscount}
                    iconFontAwesome={<FontAwesomeIcon icon="minus-circle" />}
                    backgroundColor="var(--themeSDark)"
                    variant="extended"
                    position="relative"
                    size="large"
                />
            </section>
            <section className="my-5">
                <FaqPoints />
            </section>
            <style jsx>
                {`
                    .all-game-info {
                        background: var(--themeP);
                        border-radius: 20px;
                    }

                    .discount-benefit-game-title svg {
                        font-size: 45px;
                        margin-right: 30px;
                    }
                `}
            </style>
        </section>
    );

    // const scrollIntoQASession = () => {
    //     scrollIntoView("#bottomQASession", { duration: 5000, mainContainer: "#bottomQASession" });
    // }

    return (
        <section className="text-purple">
            {showBriefAndCTA()}
            <div id="bottomQASession" />
        </section>
    );
}

function getGameName(name) {
    if (name === "targetPrize") return "Prêmio Alvo";
    if (name === "discountBack") return "Desconto Retornado";
    if (name === "topCustomers") return "Clientes Tops";
    if (name === "raffleTicket") return "Bilhete Premiado";

    return null;
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

/* ARCHIVES
const instruTxt =
        "A pontuação atual é descontada e zerada no app do cliente, iniciando um novo desafio. Mas o valor fica registrado no histórico de compras do cliente para consulta.";

const showIntruBtn = () => (
    <span className="d-inline-block ml-3">
        <InstructionBtn text={instruTxt} mode="tooltip" animated={false} />
    </span>
);

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
*/
