import { Fragment } from "react";
import { withRouter } from "react-router-dom";
import extractStrData from "utils/string/extractStrData";
import setProRenewal from "utils/biz/setProRenewal";
import { formatDMY } from "utils/dates/dateFns";
import ButtonMulti from "../../../buttons/material-ui/ButtonMulti";
import RedirectLink from "../../../RedirectLink";
import {
    textStyle,
    ShowTitle,
    ShowIllustration,
    ShowBrief,
    ShowActionBtn,
} from "./DefaultRenderComps";
// import useCount from 'hooks/useCount';

function ProPay({ history, brief, role, mainImg, bizLogo, subtype, content }) {
    const isFreeTrialEnd = subtype === "freeTrialEnd";
    const isProPayOnly = subtype === "proPay";
    const isWelcomeProPay = subtype === "welcomeProPay";
    const isExpiredDate = subtype === "proExpiredDate";
    const isNearExpiryDate = subtype === "proNearExpiryDate";
    const needOrderBtn = isExpiredDate || isNearExpiryDate;

    const contentData = content && extractStrData(content);
    // free trial data
    const maintenanceMonthExpDate =
        contentData && contentData.maintenanceMonthExpDate;
    // end free trial data
    const needDataExpiration = contentData && !contentData.approvalDate;

    const ref = needDataExpiration && contentData && contentData.ref;
    const orders =
        needDataExpiration &&
        contentData.orders &&
        JSON.parse(contentData.orders);
    const planBr = needDataExpiration && contentData.planBr;
    // const planDays = needDataExpiration && contentData.planDays;
    const expiryDate = needDataExpiration && contentData.expiryDate;
    const period = needDataExpiration && contentData.period;
    const totalMoney = needDataExpiration && contentData.totalMoney;
    // proPay and welcomeProPay
    const isExtraFreeMonth =
        contentData && contentData.isExtraFreeMonth === "true";

    const handleOrderPageClick = () => {
        setProRenewal({
            investAmount: totalMoney,
            expiryDate,
            orders,
            planBr,
            period,
        }).then(() => {
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
        if (isFreeTrialEnd) return "15 dias de teste terminaram";

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

    const GoToProSessionBtn = () => (
        <RedirectLink toDashTab="Pro">
            <ButtonMulti
                title="Ir Sessão Pro"
                color="var(--mainWhite)"
                backgroundColor="var(--themeP)"
                onClick={null}
            />
        </RedirectLink>
    );

    return (
        <section>
            <ShowTitle text={handleTitle()} />
            {showMainIllustration()}
            <ShowBrief brief={brief} />
            {isFreeTrialEnd && (
                <Fragment>
                    <p className={`${textStyle}`}>
                        Para assegurar uma melhor experiência para seus
                        clientes, todos sua base de clientes ganharam mais{" "}
                        <i>1 mês de manuntenção</i> até dia{" "}
                        <b>{formatDMY(maintenanceMonthExpDate)}</b> e já está
                        ativado. Isso significa que você, sua equipe e clientes
                        continuam usando os serviços da Fiddelize normalmente,
                        de forma gratuita.
                    </p>
                    <p className={`${textStyle}`}>
                        A única restrição é que a funcionalidade de{" "}
                        <b>
                            cadastrar novos clientes foi desativada
                            temporarimente
                        </b>{" "}
                        até que invista em um de nossos <b>planos pro</b>.
                    </p>
                    <p className={`${textStyle}`}>
                        <strong>Importante:</strong>
                        <br />
                        <strong>Durante o mês de manuntenção:</strong> O prazo
                        de expiração de todas as moedas dos clientes é ativado.
                        Os clientes recebem notificações e o prazo fica visível
                        quando eles entram no app.
                        <br />
                        <br />
                        <strong>Ao final do mês de manuntenção:</strong>
                        <br />
                        - Todas as moedas da sua base de clientes são expiradas
                        e funcionalidade de expiração desativada. Saiba mais
                        indo em app > moedas digitais > expiração de moedas.
                        <br />- Apps de membros têm acesso bloqueado;
                    </p>
                    <p className={`${textStyle}`}>
                        Para atualizar seu plano, bastar acessar seu app admin e
                        clicar em atualizar ao lado do seu plano ao entrar no
                        seu painel de controle.
                    </p>
                </Fragment>
            )}
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
                <Fragment>
                    {isExtraFreeMonth && (
                        <p className={`${textStyle} font-weight-bold`}>
                            Seu <span className="text-pill">1 mês extra</span>{" "}
                            já foi adicionado ao seu plano anual. Lembrando que
                            você tem mais 1 mês de manuntenção que é ativado
                            automaticamente na expiração do plano.
                        </p>
                    )}
                    <p className={`${textStyle} mt-5 font-weight-bold`}>
                        Agradecemos a sua preferência!
                    </p>
                </Fragment>
            )}
            <ShowActionBtn
                role={role}
                titleCliAdmin="Ir para painel"
                children={
                    needOrderBtn ? <ChildrenBtn /> : <GoToProSessionBtn />
                }
            />
        </section>
    );
}

export default withRouter(ProPay);
