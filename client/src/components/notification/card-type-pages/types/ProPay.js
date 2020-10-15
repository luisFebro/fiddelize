import React, { Fragment } from "react";
import extractStrData from "../../../../utils/string/extractStrData";
import ButtonMulti from "../../../../components/buttons/material-ui/ButtonMulti";
import setProRenewal from "../../../../utils/biz/setProRenewal";
import { withRouter } from "react-router-dom";
// import useCount from '../../../../hooks/useCount';
import {
    textStyle,
    ShowTitle,
    ShowIllustration,
    ShowBrief,
    ShowActionBtn,
} from "./DefaultRenderComps";

function ProPay({
    history,
    brief,
    role,
    mainImg,
    bizLogo,
    bizName,
    userName,
    isWelcome = false,
    subtype,
    content,
}) {
    const isProPayOnly = subtype === "proPay";
    const isWelcomeProPay = subtype === "welcomeProPay";
    const isExpiredDate = subtype === "proExpiredDate";
    const isNearExpiryDate = subtype === "proNearExpiryDate";
    const needOrderBtn = isExpiredDate || isNearExpiryDate;

    const contentData = content && extractStrData(content);
    const needDataExpiration = !contentData.approvalDate;

    const ref = needDataExpiration && contentData.ref;
    const orders = needDataExpiration && JSON.parse(contentData.orders);
    const planBr = needDataExpiration && contentData.planBr;
    // const planDays = needDataExpiration && contentData.planDays;
    const expiryDate = needDataExpiration && contentData.expiryDate;
    const period = needDataExpiration && contentData.period;
    const totalMoney = needDataExpiration && contentData.totalMoney;

    const handleOrderPageClick = () => {
        setProRenewal({
            investAmount: totalMoney,
            expiryDate,
            orders,
            planBr,
            ref,
            period,
        }).then((res) => {
            history.push("/pedidos/admin");
        });
    };

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

    const ChildrenBtn = () => (
        <ButtonMulti
            title="Renovar Plano"
            color="var(--mainWhite)"
            backgroundColor="var(--themeP)"
            onClick={handleOrderPageClick}
        />
    );

    return (
        <section>
            <ShowTitle text={handleTitle()} />
            {showMainIllustration()}
            <ShowBrief brief={brief} />
            {isExpiredDate && (
                <p className={`${textStyle} font-weight-bold`}>
                    ID: {ref}
                    <br />
                    <br />
                    Renove, continue usando e cadastre mais clientes!
                </p>
            )}
            {isNearExpiryDate && (
                <p className={`${textStyle} font-weight-bold`}>
                    ID: {ref}
                    <br />
                    <br />
                    Renove esse plano a qualquer momento.
                    <br />
                    Continue fiddelizando!
                </p>
            )}
            {(isWelcomeProPay || isProPayOnly) && (
                <p className={`${textStyle} mt-y font-weight-bold`}>
                    Agradecemos a sua preferência!
                </p>
            )}
            <ShowActionBtn
                role={role}
                titleCliAdmin="Ir para painel"
                children={needOrderBtn ? <ChildrenBtn /> : undefined}
            />
        </section>
    );
}

export default withRouter(ProPay);
