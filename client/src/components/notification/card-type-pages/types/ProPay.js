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

    // useCount("ProPay");
    const showMainIllustration = () => (
        <Fragment>
            {isProPayOnly ? (
                <ShowIllustration
                    role={role}
                    mainImg={mainImg}
                    bizLogo={bizLogo}
                />
            ) : (
                <img
                    className="img-center"
                    src="/img/illustrations/club-pro-welcome.svg"
                    alt="demo sessão novidades"
                    height="auto"
                    width="90%"
                />
            )}
        </Fragment>
    );

    return (
        <section>
            <ShowTitle
                text={isProPayOnly ? "Pagamento Aprovado" : "Club Pro"}
            />
            {showMainIllustration()}
            <ShowBrief brief={brief} />
            <p className={`${textStyle} mt-y font-weight-bold`}>
                Agradecemos a sua preferência!
            </p>
            <ShowActionBtn role={role} titleCliAdmin="Ir para painel" />
        </section>
    );
}
