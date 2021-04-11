import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import extractStrData from "../../../../utils/string/extractStrData";
import { default as DiscountModalBtn } from "../../../../pages/dashboard-client-admin/dash-clients/clients-history/card-hidden-content/modal/modal-text-field/ModalBtn";
import { addDays, formatDMY } from "../../../../utils/dates/dateFns";
import { removeVersion, removeVar } from "../../../../hooks/storage/useVar";
import { useClientUser } from "../../../../hooks/useRoleData";
import defineCurrChallenge from "../../../../utils/biz/defineCurrChallenge";

import {
    textStyle,
    ShowTitle,
    ShowIllustration,
    ShowBrief,
    ShowActionBtn,
} from "./DefaultRenderComps";

export default function Challenge({
    subtype,
    content,
    senderId,
    userName,
    role,
    brief,
    mainImg,
    bizLogo,
    updatedBy,
}) {
    const [clickedCTA, setClickedCTA] = useState(false);

    const confirmedChall = subtype === "confirmedChall";
    if (confirmedChall) role = "cliente";

    const { totalPurchasePrize } = useClientUser();

    const updatedCurrChall = defineCurrChallenge(totalPurchasePrize);

    useEffect(() => {
        if (confirmedChall && clickedCTA) {
            removeVersion({
                key: "alreadyAlertChallenge",
                value: updatedCurrChall,
            }).then((res) => {
                removeVar("pendingChall");
            });
        }
    }, [confirmedChall, clickedCTA, updatedCurrChall]);

    const handleCTA = (res) => {
        setClickedCTA(res);
    };

    const {
        currScore,
        totalPrizes,
        rewardScore,
        currChall,
        clientFullName,
        phone,
        // confirmedChall
        prizeId,
        prizeDeadline = 30,
        prizeDesc,
        prizeConfirmationDate,
    } = extractStrData(content);

    const showCliWonChallContent = () => null; // infos moved to discount modal or brief

    // buggy with invalid time range (watching for errors) -SOLVED - this is because one notification is sending without date (cliWonCHall)
    const addedDaysToDate = prizeConfirmationDate
        ? addDays(new Date(prizeConfirmationDate), Number(prizeDeadline) + 1)
        : new Date();
    const deadlineDate = formatDMY(addedDaysToDate);
    const showConfirmedChallContent = () =>
        confirmedChall && (
            <main className={textStyle}>
                <header className="font-weight-bold">
                    {userName}, segue os detalhes:
                </header>
                <br />
                <p>
                    ✔ Prêmio do desafio nº {currChall}:
                    <br />
                    <strong> • {prizeDesc}</strong>
                </p>
                <p>
                    ✔ Prazo para resgatar prêmio:
                    <br />
                    <strong>
                        • {prizeDeadline} dias
                        <br />
                        <span> (até {deadlineDate})</span>
                    </strong>
                </p>
            </main>
        );

    const DiscountBtn = (
        <DiscountModalBtn
            button={{
                iconFontAwesome: <FontAwesomeIcon icon="minus-circle" />,
                backgroundColor: "var(--themeSDark)",
                title: "Descontar Pontos",
                variant: "extended",
                position: "relative",
                size: "large",
                needCloseOtherModals: true,
            }}
            modalData={{
                title: "Desconto de Pontos<br />do Cliente",
                subTitle: null,
                labelTxtField: "Valor para ser descontado:",
                txtBtn: "Descontar",
                iconBtn: <FontAwesomeIcon icon="minus-circle" />,
                rewardScore,
                userId: senderId,
                name: clientFullName,
                phone,
                userCurrScore: Number(currScore),
                totalActiveScore: Number(currScore),
                totalPrizes: Number(totalPrizes),
                prizeId,
                updatedBy,
            }}
        />
    );

    return (
        <section>
            <ShowTitle
                text={
                    confirmedChall
                        ? "Confirmação de Prêmio"
                        : "Desafio Concluído"
                }
            />
            <ShowIllustration role={role} mainImg={mainImg} bizLogo={bizLogo} />
            <ShowBrief brief={brief} />
            {showCliWonChallContent()}
            {showConfirmedChallContent()}
            <ShowActionBtn
                role={role}
                titleCliAdmin="descontar pontos"
                titleCliUser="começar novo desafio"
                children={confirmedChall ? null : DiscountBtn}
                callback={handleCTA}
            />
        </section>
    );
}
