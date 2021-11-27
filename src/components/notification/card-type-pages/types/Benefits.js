import { useState, Fragment } from "react";
import { formatDMY } from "utils/dates/dateFns";
import extractStrData from "utils/string/extractStrData";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { gameBrNameStore } from "components/biz/GamesBadge";
import {
    ShowTitle,
    ShowIllustration,
    ShowBrief,
    textStyle,
} from "./DefaultRenderComps";

export default function Benefits({
    role,
    mainImg,
    content,
    userName,
    bizLogo,
    bizName,
    brief,
    subtype,
}) {
    const [loading, setLoading] = useState(false);

    const isBenefitsExp = subtype === "expirationEnd";
    const isRemovedChall = subtype === "removedChallType";

    const {
        beatGamesData = [],
        expDate = new Date(),
        expDaysCount = 0,
    } = extractStrData(content);

    const handleCTA = () => {
        setLoading(true);

        window.location.href =
            role === "cliente-admin" ? "/app?client-admin=1" : "/app";

        setLoading(false);
    };

    const beatGamesDataTreated = beatGamesData.length
        ? JSON.parse(beatGamesData)
        : [];
    const totalBenefits = beatGamesDataTreated && beatGamesDataTreated.length;

    const showBenefitList = () => {
        // the deadlineDate will have exactly 30 days span of difference which does not mean exactly the same day like 5 set and 5 out since monthes quantity may vary from 28 to 31 days making slightly different days
        const deadlineDate = formatDMY(expDate);

        return (
            <Fragment>
                {beatGamesDataTreated.map((elem) => (
                    <section key={elem.game} className="mt-5 text-normal">
                        <h2 className="text-subtitle font-weight-bold">
                            {gameBrNameStore[elem.game]} N.º{" "}
                            {elem.currChall || 1}
                        </h2>
                        ✔ Meta alcançada:
                        <h2 className="text-normal font-weight-bold">
                            {elem.targetPoints} PTS
                        </h2>
                        ✔ Benefício:
                        <h2 className="text-normal font-weight-bold">
                            {elem.benefitDesc}
                        </h2>
                        <p>
                            ✔ Prazo para resgatar:
                            <br />
                            {!expDaysCount ? (
                                <strong>
                                    Resgate na sua próxima compra ou assim que
                                    visitar a {bizName}
                                </strong>
                            ) : (
                                <strong>
                                    • Benefício válido por {expDaysCount} dias
                                    <br />
                                    <span> (até {deadlineDate})</span>
                                </strong>
                            )}
                        </p>
                    </section>
                ))}
            </Fragment>
        );
    };

    const handleTitle = () => {
        if (isRemovedChall) return "Desafio Removido";
        if (isBenefitsExp) return "Expirações Efetuadas";
        return "Benefícios Disponíveis";
    };

    const showMainContent = () => {
        if (isRemovedChall) {
            return (
                <Fragment>
                    <p>
                        Mas não se preocupe, seu saldo em moedas e edição do
                        desafio continua o mesmo.
                    </p>
                    <p>
                        E seu progresso foi ajustado para um desafio mais
                        próximo com outro benefício.
                    </p>
                    <p className="font-weight-bold font-italic">
                        Agradecemos sua compreensão,
                        <br />
                        Boas compras!
                    </p>
                </Fragment>
            );
        }

        if (isBenefitsExp) {
            return (
                <Fragment>
                    <p>
                        {userName}, continue acumulando moedas PTS e fique
                        atento a futuras expirações para aproveitar todos seus
                        benefícios e fique atento nas{" "}
                        <strong>regras do clube de compras</strong>. Boas
                        compras!
                    </p>
                </Fragment>
            );
        }

        return (
            <Fragment>
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
            </Fragment>
        );
    };

    return (
        <Fragment>
            <ShowTitle text={handleTitle()} />
            <ShowIllustration role={role} mainImg={mainImg} bizLogo={bizLogo} />
            <ShowBrief brief={brief} />
            <section className={textStyle}>{showMainContent()}</section>
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
