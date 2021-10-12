import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import convertToReal from "utils/numbers/convertToReal";
import useData from "init";
import getAPI, { changeBenefit } from "api";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import showToast from "components/toasts";
import { gameIconsStore } from "components/biz/GamesBadge";
import getFirstName from "utils/string/getFirstName";
import { setRun, useAction } from "global-data/ui";
import getId from "utils/getId";
import FaqPoints from "./FaqPoints";
// import scrollIntoView from "utils/document/scrollIntoView";

export default function DiscountBenefit(props) {
    const [disableCTA, setDisableCTA] = useState(false);
    const [loading, setLoading] = useState(true);

    const uify = useAction();

    const [staffJob] = useData(["memberJob"], { dots: false });

    const {
        closeModal,
        closeScanner, // only for qrCode
        customerId,
        recordId,
        totalBenefitsList,
        allBenefitGames,
        currPoints,
        customerName,
        gender,
        gameName,
    } = props;

    const benefitData = allBenefitGames.find((g) => g.game === gameName);
    const benefitId = benefitData && benefitData.id;
    const benefitDesc = benefitData && benefitData.benefitDesc;
    const currChall = (benefitData && benefitData.currChall) || 1;
    const targetPoints = benefitData && benefitData.targetPoints;

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

        // used to check unavailable games
        const allAvailableGames = allBenefitGames.map((g) => ({
            game: g.game,
            targetPoints: g.targetPoints,
        }));

        const benefitBody = {
            allAvailableGames,
            customerId,
            recordId,
            benefitId,
            benefitTarget: targetPoints,
            benefitDesc,
            isReceived: true,
            newPoints: Number(targetPoints),
            newBalance: leftCustomerPoints,
            totalBenefitsList: totalBenefitsList || 1,
            gameName,
            currChall,
            staff: {
                id: staffId,
                job: staffJob || "admin",
                role,
                name: staffName,
            },
        };

        await getAPI({
            method: "put",
            url: changeBenefit(),
            body: benefitBody,
            params: { userId: staffId }, // for token verify
        });

        setLoading(false);

        const uniqueId = getId();
        setRun("runName", `PendingBenefitsList${uniqueId}`, uify);

        showToast(
            `Benefício registrado com sucesso, ${firstStaffName}! Agora ${
                gender === "Ele" ? "seu" : "sua"
            } cliente ${
                name && name.toUpperCase()
            } já pode receber o benefício. (${benefitDesc})`,
            { type: "success", dur: 15000 }
        );

        setTimeout(() => {
            closeModal();
            if (typeof closeScanner === "function") closeScanner();
        }, 2500);

        return false;
    };

    const showBriefAndCTA = () => (
        <section className="margin-auto-90 text-center">
            <h2 className="mt-2 text-center text-purple text-subtitle font-weight-bold">
                Recebimento de
                <br />
                Benefício pelo cliente
            </h2>
            <p
                style={{
                    top: "15px",
                }}
                className="position-relative text-normal text-left"
            >
                para: <strong>{name && name.cap()}</strong>
            </p>
            <div className="all-game-info text-left text-normal text-white text-shadow mt-3 mb-1 text-center">
                <p className="discount-benefit-game-title pt-1 m-0 font-weight-bold">
                    {gameIconsStore[gameName]}
                    {getGameName(gameName)}
                    <br />
                    <span className="d-block position-relative">
                        N.º {currChall}
                    </span>
                </p>
                <div>
                    <p className="mx-3 pb-2 text-left font-weight-bold">
                        <span className="d-block font-weight-normal">
                            {benefitDesc}
                        </span>
                        <span className="font-weight-normal">Meta:</span>{" "}
                        {targetPoints} PTS
                    </p>
                </div>
            </div>
            <div className="mt-4 text-left text-normal text-purple">
                <p className="m-0">✔ Saldo do cliente:</p>
                <p>
                    <strong>
                        + {convertToReal(currCustomerPoints)} PTS (atual)
                        <br />- {targetPoints} PTS
                    </strong>
                </p>
                <div className="container-center justify-content-start">
                    <p className="text-pill text-white text-shadow font-weight-bold text-nowrap text-em-1-4">
                        {convertToReal(leftCustomerPoints)} PTS
                    </p>
                </div>
            </div>
            <section className="container-center mt-3 mb-5">
                <ButtonFab
                    disabled={disableCTA}
                    title="Confirmar recebimento"
                    width="100%"
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
                        margin-right: 20px;
                    }

                    .discount-benefit-game-title span {
                        top: -10px;
                    }
                `}
            </style>
        </section>
    );

    // const scrollIntoQASession = () => {
    //     scrollIntoView("#bottomQASession", { duration: 5000, mainContainer: "#bottomQASession" });
    // }
    if (!loading) {
        return (
            <section className="full-height text-center">
                <h2 className="mt-2 mb-4 text-center text-purple text-subtitle font-weight-bold">
                    Recebimento de
                    <br />
                    Benefício pelo cliente
                </h2>
                <p className="animated fadeInUp mt-5 text-subtitle font-weight-bold text-purple text-purple">
                    Finalizando...
                </p>
            </section>
        );
    }

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
<p className="text-normal font-weight-bold mt-3 mx-3 m-0">
    Confirmar benefício e descontar pontos?
</p>

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
