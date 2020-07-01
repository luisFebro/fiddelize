import React from 'react';
import extractStrData from '../../../../utils/string/extractStrData';
import { default as DiscountModalBtn } from "../../../../pages/dashboard-client-admin/dash-clients/clients-history/card-hidden-content/modal/modal-text-field/ModalBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
        prizeDesc
    } = extractStrData(content);

    const showCliWonChallContent = () => (
        subtype === "clientWonChall" &&
        <main className={textStyle}>
            <header className="font-weight-bold">
                {userName}, estes são os detalhes:
            </header>
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
            <ShowActionBtn
                role={role}
                titleCliAdmin="descontar pontos"
                children={DiscountBtn}
            />
        </section>
    );
}

