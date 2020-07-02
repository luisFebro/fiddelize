import React from 'react';
import extractStrData from '../../../../utils/string/extractStrData';
import { default as DiscountModalBtn } from "../../../../pages/dashboard-client-admin/dash-clients/clients-history/card-hidden-content/modal/modal-text-field/ModalBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addDays, formatDMY } from '../../../../utils/dates/dateFns';

import {
    textStyle,
    ShowTitle,
    ShowIllustration,
    ShowBrief,
    ShowActionBtn
} from './DefaultRenderComps';

export default function Challenge({
    subtype,
    content,
    senderId,
    userName,
    role,
    brief,
    mainImg,
    bizLogo
}) {
    const {
        currScore,
        totalPrizes,
        rewardScore,
        currChall,
        clientFullName,
        // confirmedChall
        prizeDeadline,
        prizeDesc,
        prizeConfirmationDate,
    } = extractStrData(content);

    const showCliWonChallContent = () => (
        subtype === "clientWonChall" &&
        <main className={textStyle}>
            <header className="font-weight-bold">
                {userName}, estes são os detalhes:
            </header>
            <br />
            <p>
                ✔ Nome do Cliente:
                <br />
                <strong> • {clientFullName}</strong>
            </p>
            <p>
                ✔ Desafio Concluído:
                <br />
                <strong>• N.º {currChall}</strong>
            </p>
            <p>
                ✔ Prêmio do desafio:
                <br />
                <strong>• {prizeDesc}</strong>
            </p>
        </main>
    );

    const confirmedChall = subtype === "confirmedChall";
    const addedDaysToDate = addDays(new Date(prizeConfirmationDate), Number(prizeDeadline));
    const deadlineDate = formatDMY(addedDaysToDate);
    const showConfirmedChallContent = () => (
        confirmedChall &&
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
                    <span > (até {deadlineDate})</span>
                </strong>
            </p>
        </main>
    );

    const DiscountBtn = (
        <DiscountModalBtn
            button={{
                iconFontAwesome: <FontAwesomeIcon icon="minus-circle" />,
                backgroundColor: 'var(--themeSDark)',
                title: "Descontar Pontos",
                variant: 'extended',
                position: 'relative',
                size: "large",
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
                userCurrScore: Number(currScore),
                totalActiveScore: Number(currScore),
                totalPrizes: Number(totalPrizes),
            }}
        />
    );

    return (
        <section>
            <ShowTitle text="Cliente concluíu desafio" />
            <ShowIllustration role={role} mainImg={mainImg} bizLogo={bizLogo} />
            <ShowBrief brief={brief} />
            {showCliWonChallContent()}
            {showConfirmedChallContent()}
            <ShowActionBtn
                role={role}
                titleCliAdmin="descontar pontos"
                titleCliUser="começar novo desafio"
                children={confirmedChall ? null : DiscountBtn}
            />
        </section>
    );
}

