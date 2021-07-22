import { useState, Fragment } from "react";
import { addDays, formatDMY } from "utils/dates/dateFns";
import extractStrData from "utils/string/extractStrData";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { gameBrNameStore } from "components/biz/GamesBadge";
import {
    ShowTitle,
    ShowIllustration,
    ShowBrief,
    textStyle,
} from "./DefaultRenderComps";

export default function CliUserConfirmedChall({
    role,
    mainImg,
    content,
    userName,
    bizLogo,
    brief,
}) {
    const [loading, setLoading] = useState(false);

    const {
        prizeDeadline,
        beatGamesData,
        prizeConfirmationDate,
    } = extractStrData(content);

    const beatGamesDataTreated = JSON.parse(beatGamesData);
    const totalBenefits = beatGamesDataTreated && beatGamesDataTreated.length;

    const addedDaysToDate = prizeConfirmationDate
        ? addDays(new Date(prizeConfirmationDate), Number(prizeDeadline) + 1)
        : new Date();
    const deadlineDate = formatDMY(addedDaysToDate);

    const handleCTA = () => {
        setLoading(true);

        window.location.href =
            role === "cliente-admin"
                ? "/mobile-app?client-admin=1"
                : "/mobile-app";

        setLoading(false);
    };

    const showBenefitList = () => (
        <Fragment>
            {beatGamesDataTreated.map((elem) => (
                <section key={elem.game} className="mt-5 text-normal">
                    <h2 className="text-subtitle font-weight-bold">
                        {gameBrNameStore[elem.game]} N.º {elem.currChall}
                    </h2>
                    ✔ Meta alcançada:
                    <h2 className="text-normal font-weight-bold">
                        {elem.targetPoints} PTS
                    </h2>
                    ✔ Benefício:
                    <h2 className="text-normal font-weight-bold">
                        {elem.benefitDesc}
                    </h2>
                    {elem.game === "targetPrize" && (
                        <p>
                            ✔ Prazo para resgatar prêmio:
                            <br />
                            <strong>
                                • {prizeDeadline || 30} dias
                                <br />
                                <span> (até {deadlineDate})</span>
                            </strong>
                        </p>
                    )}
                </section>
            ))}
        </Fragment>
    );

    return (
        <Fragment>
            <ShowTitle text="Benefícios Disponíveis" />
            <ShowIllustration role={role} mainImg={mainImg} bizLogo={bizLogo} />
            <ShowBrief brief={brief} />
            <section className={textStyle}>
                <header className="mt-3 font-weight-bold">
                    {userName}, segue detalhes benefícios disponíveis:
                </header>
                {showBenefitList()}
                {totalBenefits > 1 && (
                    <p className="text-small mt-5 font-weight-bold">
                        <strong className="text-normal">Notas:</strong>
                        <br />- Você pode escolher qual benefício quer resgatar
                        de acordo com o seu{" "}
                        <strong>saldo disponível em PTS</strong>.
                    </p>
                )}
                <section className="container-center my-5">
                    <ButtonFab
                        title={loading ? "Processando..." : "Voltar"}
                        onClick={handleCTA}
                        backgroundColor="var(--themeSDark)"
                        variant="extended"
                        position="relative"
                        size="large"
                    />
                </section>
            </section>
        </Fragment>
    );
}

// HELPERS
// handle the variable version to be removed - challenge_1 - always insert _1 to get the version.
// function removeVersion({ key, value }) {
//     if (!key || !value) return null;

//     return getVar(key).then((storedVersion) => {
//         const currVersion = Number(value);
//         if (currVersion >= Number(storedVersion)) {
//             removeVar(key);
//         }
//     });
// }
// END HELPERS
