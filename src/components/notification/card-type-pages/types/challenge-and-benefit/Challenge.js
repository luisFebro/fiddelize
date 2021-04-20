import extractStrData from "../../../../../utils/string/extractStrData";
import { addDays, formatDMY } from "../../../../../utils/dates/dateFns";
import { Load } from "../../../../code-splitting/LoadableComp";

export const AsyncDiscountBenefit = Load({
    loader: () =>
        import(
            "./DiscountBenefit" /* webpackChunkName: "discount-benefit-comp-lazy" */
        ),
});

import CliUserConfirmedChall from "./CliUserConfirmedChall";

import { ShowTitle, ShowIllustration, ShowBrief } from "../DefaultRenderComps";

export default function Challenge({
    cardId,
    subtype,
    content,
    senderId,
    userName,
    role,
    brief,
    mainImg,
    bizLogo,
    updatedBy,
    handleFullClose,
}) {
    const cliWonChall = subtype === "clientWonChall";
    const confirmedChall = subtype === "confirmedChall";
    if (confirmedChall) role = "cliente";

    const {
        currScore,
        rewardScore,
        totalPrizes,
        currChall,
        clientFullName,
        // confirmedChall
        prizeId,
        prizeDeadline = 30,
        prizeDesc,
        prizeConfirmationDate,
        gender,
    } = extractStrData(content);

    const addedDaysToDate = prizeConfirmationDate
        ? addDays(new Date(prizeConfirmationDate), Number(prizeDeadline) + 1)
        : new Date();
    const deadlineDate = formatDMY(addedDaysToDate);

    const showDiscountBenefit = () => {
        const modalData = {
            rewardScore,
            senderId,
            cardId,
            name: clientFullName,
            userCurrScore: Number(currScore),
            totalPrizes: Number(totalPrizes),
            prizeId,
            prizeDesc,
            updatedBy,
            gender,
        };

        return (
            <AsyncDiscountBenefit
                onClose={handleFullClose}
                modalData={modalData}
            />
        );
    };

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
            {cliWonChall && showDiscountBenefit()}
            {confirmedChall && (
                <CliUserConfirmedChall
                    userName={userName}
                    currChall={currChall}
                    prizeDesc={prizeDesc}
                    prizeDeadline={prizeDeadline}
                    deadlineDate={deadlineDate}
                />
            )}
        </section>
    );
}
