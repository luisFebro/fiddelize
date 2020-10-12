import React, { Fragment } from "react";
import ButtonMulti from "../../../../components/buttons/material-ui/ButtonMulti";
// import useCount from '../../../../hooks/useCount';
import {
    textStyle,
    ShowTitle,
    ShowIllustration,
    ShowBrief,
    ShowActionBtn,
} from "./DefaultRenderComps";

// const areEqual = ({state:prev}, {state:next}) =>
//   JSON.stringify(prev) !== JSON.stringify(next)

export default function ProPay({
    brief,
    role,
    mainImg,
    bizLogo,
    bizName,
    userName,
    isWelcome = false,
    subtype,
}) {
    const isProPayOnly = subtype === "proPay";
    const isWelcomeProPay = subtype === "welcomeProPay";
    const isExpiredDate = subtype === "proExpiredDate";
    const isNearExpiryDate = subtype === "proNearExpiryDate";

    // useCount("ProPay");
    const showMainIllustration = () => (
        <Fragment>
            {isWelcomeProPay ? (
                <img
                    className="img-center"
                    src="/img/illustrations/club-pro-welcome.svg"
                    alt="demo sessão novidades"
                    height="auto"
                    width="90%"
                />
            ) : (
                <ShowIllustration
                    role={role}
                    mainImg={mainImg}
                    bizLogo={bizLogo}
                />
            )}
        </Fragment>
    );

    const handleTitle = () => {
        if (isNearExpiryDate) return "Lembrete de Vencimento";
        if (isExpiredDate) return "Plano Expirado";
        return isProPayOnly ? "Pagamento Aprovado" : "Club Pro";
    };

    const handleBtnTitle = () => {
        if (isNearExpiryDate || isExpiredDate) return "Renovar plano";
        return "Ir para painel";
    };

    return (
        <section>
            <ShowTitle text={handleTitle()} />
            {showMainIllustration()}
            <ShowBrief brief={brief} />
            {isExpiredDate && (
                <p className={`${textStyle} mt-y font-weight-bold`}>
                    Renove, continue usando e cadastre mais clientes!
                </p>
            )}
            {isNearExpiryDate && (
                <p className={`${textStyle} mt-y font-weight-bold`}>
                    Renove esse plano a qualquer momento.
                    <br />
                    Continue fidelizando!
                </p>
            )}
            {(isWelcomeProPay || isProPayOnly) && (
                <p className={`${textStyle} mt-y font-weight-bold`}>
                    Agradecemos a sua preferência!
                </p>
            )}
            <ShowActionBtn role={role} titleCliAdmin={handleBtnTitle()} />
        </section>
    );
}
