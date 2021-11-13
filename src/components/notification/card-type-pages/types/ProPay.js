import { Fragment } from "react";
import { withRouter } from "react-router-dom";
import extractStrData from "utils/string/extractStrData";
import setProRenewal from "utils/biz/setProRenewal";
import { formatDMY } from "utils/dates/dateFns";
import showToast from "components/toasts";
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

    const contentData = content && extractStrData(content);
    // proPay and welcomeProPay
    const isExtraFreeMonth =
        contentData && contentData.isExtraFreeMonth === "true";

    const handleOrderPageClick = () => {
        if (!contentData) return showToast("Algo deu errado.");
        const { planBr, orders, period, totalMoney } = contentData;

        setProRenewal({
            investAmount: totalMoney,
            period,
            itemList: JSON.parse(orders),
            planBr,
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

    const ChildrenBtnData =
        isExpiredDate || isNearExpiryDate ? (
            <ChildrenBtn />
        ) : (
            <GoToProSessionBtn />
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
                        <b>
                            {formatDMY(
                                contentData &&
                                    contentData.maintenanceMonthExpDate
                            )}
                        </b>{" "}
                        e já está ativado. Isso significa que você, sua equipe e
                        clientes continuam usando os serviços da Fiddelize
                        normalmente como se o plano estivesse ativo.
                    </p>
                    <p className={`${textStyle}`}>
                        Devido à expiração dos créditos, a{" "}
                        <strong>única restrição</strong> é que a funcionalidade
                        de{" "}
                        <b>
                            cadastrar novos clientes e membros foi desativada
                            temporarimente
                        </b>{" "}
                        até renovação do <b>plano pro</b>.
                    </p>
                    <p className={`${textStyle}`}>
                        <strong>Ao final do mês de manuntenção:</strong>
                        <br />
                        - Todas as moedas da sua base de clientes são expiradas
                        e funcionalidade de expiração desativada. Saiba mais
                        indo em app > moedas digitais > expiração de moedas.
                        <br />
                        <br />- As principais funcionalidades dos apps de equipe
                        e admin são temporarimente bloqueados: cadastrar
                        clientes e moedas digitais PTS;
                    </p>
                    <p className={`${textStyle}`}>
                        Para atualizar seu plano, bastar acessar seu app admin e
                        clicar em atualizar ao lado do seu plano ao entrar no
                        seu painel de controle.
                    </p>
                </Fragment>
            )}
            {isExpiredDate && (
                <Fragment>
                    <p className={`${textStyle}`}>
                        Devido à expiração dos créditos, a{" "}
                        <strong>única restrição</strong> é que a funcionalidade
                        de{" "}
                        <b>
                            cadastrar novos clientes e membros foi desativada
                            temporarimente
                        </b>{" "}
                        até renovação do <b>plano pro</b>.
                    </p>
                    <p className={`${textStyle}`}>
                        <strong>Ao final do mês de manuntenção:</strong>
                        <br />
                        - Todas as moedas da sua base de clientes são expiradas
                        e funcionalidade de expiração desativada. Saiba mais
                        indo em app > moedas digitais > expiração de moedas.
                        <br />
                        <br />- As principais funcionalidades dos apps de equipe
                        e admin são temporarimente bloqueados: cadastrar
                        clientes e moedas digitais PTS;
                    </p>
                    <p className={`${textStyle}`}>
                        Para atualizar seu plano, bastar acessar seu app admin e
                        clicar em atualizar ao lado do seu plano ao entrar no
                        seu painel de controle.
                    </p>
                    <p className={`${textStyle} font-weight-bold`}>
                        Referência Plano Expirado:
                        <br />
                        <strong className="text-pill">
                            {contentData && contentData.ref}
                        </strong>
                        <br />
                        <br />
                        Renove para continuar cadastrando mais clientes no seu
                        clube de compras.
                    </p>
                </Fragment>
            )}
            {isNearExpiryDate && (
                <p className={`${textStyle} font-weight-bold`}>
                    Referência do plano:
                    <br />
                    <strong className="text-pill">
                        {contentData && contentData.ref}
                    </strong>
                    <br />
                    <br />
                    Renove este plano a qualquer momento. Continue fiddelizando!
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
                children={ChildrenBtnData}
            />
        </section>
    );
}

export default withRouter(ProPay);
