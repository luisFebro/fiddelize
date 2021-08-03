import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withRouter } from "react-router-dom";
import getFirstName from "utils/string/getFirstName";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import Img from "components/Img";
import setProRenewal from "utils/biz/setProRenewal";
import { PeriodSelection } from "../../../comps/MainComps";
import Simulator from "./Simulator";

export default withRouter(AsyncAddCustomersContent);

function AsyncAddCustomersContent({ history, modalData, handleFullClose }) {
    let {
        handleItem,
        period,
        // creditsBadge
        isCreditsBadge,
        currPlan,
        expiryDate,
        // end creditsBadge
    } = modalData;

    const [data, setData] = useState({
        totalPackage: 0,
        totalCustomers: 0,
        inv: 0,
        innerPeriod: "monthly",
        // SKU: "",
    });
    const { inv, totalPackage, totalCustomers, innerPeriod } = data;

    period = period || innerPeriod;

    const handleInnerPeriod = (newPeriod) => {
        setData({ ...data, innerPeriod: newPeriod });
    };

    const handleData = (newData) => {
        setData({
            ...data,
            ...newData,
        });
    };

    const handlePeriodName = () => {
        if (isCreditsBadge) return "";
        return period === "yearly" ? "Anual" : "Mensal";
    };

    const showTitle = () => (
        <div className="mt-4">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                &#187; Novvos Clientes
                <br />
                {handlePeriodName()}
            </p>
        </div>
    );

    const showNotes = () => (
        <section className="my-3 text-left mx-3">
            <p className="text-purple text-left text-subtitle font-weight-bold m-0">
                Notas <FontAwesomeIcon icon="info-circle" />
            </p>
            <p className="text-small text-left text-purple mt-3">
                - Os créditos são <strong>liberados automaticamente</strong>{" "}
                após a aprovação do pagamento.
            </p>
            <p className="text-small text-left text-purple mt-3">
                - Caso ainda possua créditos válidos anteriores, o sistema da
                Fiddelize <strong>acumula esses créditos com os atuais</strong>.
                O <strong>tempo de validade</strong> é acumulado da mesma forma
                também.
            </p>
            <p className="text-small text-left text-purple mt-3">
                - Quando expira seu tempo de uso, os seus{" "}
                <strong>créditos restantes são zerados</strong>. Você é
                notificado <strong>5 dias</strong> antes do prazo expirar.
                Renovando o serviço, você extende o tempo de uso dos créditos.
            </p>
            <p className="text-small text-left text-purple mt-3">
                - Uma vez cadastrado, seus clientes usam o{" "}
                <strong>app sem limites</strong>, mesmo quando seu plano
                expirar. Você só vai precisar investir em novos clientes.
            </p>
        </section>
    );

    const handleCTA = () => {
        const isFunc = typeof handleItem === "function";

        const item = {
            name: "Novvos Clientes",
            count: totalCustomers,
            amount: inv,
            totalPackage,
        };

        if (isFunc) {
            handleItem("update", { item });
            handleFullClose();
        }

        if (isCreditsBadge) {
            setProRenewal({
                expiryDate,
                orderList: [{ "Novvos Clientes": item }],
                period: innerPeriod,
                planBr: currPlan,
                ref: undefined,
                investAmount: inv,
                isSingleRenewal: true,
            }).then(() => {
                history.push("/pedidos/admin");
            });
        }
    };

    const showCTA = () => (
        <section className="my-5 container-center">
            <ButtonFab
                size="large"
                title="Adicionar"
                onClick={handleCTA}
                backgroundColor="var(--themeSDark--default)"
                variant="extended"
                position="relative"
            />
        </section>
    );

    const showIllustration = () => (
        <Img
            src="/img/illustrations/empty-recorded-customers.svg"
            className=""
            alt="ilustração principal"
            width={200}
            height="auto"
        />
    );

    const showPeriodSelection = () => (
        <PeriodSelection containerCenter handlePeriod={handleInnerPeriod} />
    );

    return (
        <section>
            {showTitle()}
            {showIllustration()}
            {isCreditsBadge && showPeriodSelection()}
            <p className="my-3 text-purple text-center text-subtitle">
                Deslize para mudar a quantidade de pacotes.
            </p>
            <Simulator
                handleData={handleData}
                period={period}
                currPlan={currPlan}
                animaDisabled
            />
            {showNotes()}
            {showCTA()}
        </section>
    );
}
