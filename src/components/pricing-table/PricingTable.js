// reference: https://codepen.io/htmlcodex/pen/JjYmEeV
import { Fragment, useState } from "react";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import { PeriodSelection } from "pages/plans-page/plan-modes/comps/MainComps";
import { getMinPrice, getMaxCredit } from "utils/biz/pricing";
import convertToReal from "utils/numbers/convertToReal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SelectPlanBtns from "./select-plan-btns/SelectPlanBtns";

export default function PricingTable({ setCurrPlan, marginTop }) {
    const [planDur, setPlanDur] = useState("monthly");
    const isYearly = planDur === "yearly";
    const currPlanBr = isYearly ? "ano" : "mês";

    // pricing
    const minPriceData = getMinPrice(planDur);
    const goldPricing = convertToReal(minPriceData.gold);
    const silverPricing = convertToReal(minPriceData.silver);
    const bronzePricing = convertToReal(minPriceData.bronze);
    // end pricing

    // credits
    const maxCreditData = getMaxCredit(planDur);
    const silverMaxClientCredits = convertToReal(
        maxCreditData.silver["Novvos Clientes"]
    );
    const silverMaxMemberCredits = convertToReal(
        maxCreditData.silver["Connecta Membros"]
    );
    const bronzeMaxClientCredits = convertToReal(
        maxCreditData.bronze["Novvos Clientes"]
    );
    const bronzeMaxMemberCredits = convertToReal(
        maxCreditData.bronze["Connecta Membros"]
    );
    // end credits

    const handlePlanDuration = (res) => {
        console.log("res", res);
        setPlanDur(res);
    };

    const DefaultFeatures = () => (
        <Fragment>
            <li>{getStatusIcon("on")} Todos serviços integrados</li>
            <li>
                {getStatusIcon("on")} Gestão completa da moeda digital PTS e
                benefícios
            </li>
            <li>{getStatusIcon("on")} 2 Jogos de compra</li>
        </Fragment>
    );

    const DefaultFeaturesBottom = () => (
        <Fragment>
            <li>{getStatusIcon("on")} +1 mês de manutenção</li>
            <li>{getStatusIcon("off")} créditos SMS</li>
        </Fragment>
    );

    return (
        <section
            style={{
                marginTop,
            }}
        >
            <h1 className="container-center">
                <p
                    className="m-0 text-pill my-3 text-center text-white text-subtitle"
                    style={{
                        backgroundColor: "var(--themePDark)",
                    }}
                >
                    Compare planos pro
                </p>
            </h1>
            <div className="mb-5 container-center">
                <PeriodSelection callback={handlePlanDuration} />
            </div>
            <div className="pricing-table">
                <div className="ptable-item">
                    <div className="ptable-single">
                        <div
                            className="ptable-header text-shadow"
                            style={{
                                background: "#bfac07",
                            }}
                        >
                            <div className="ptable-title">
                                <h2 className="container-center text-subtitle">
                                    Ouro
                                    {getCrownIcon()}
                                </h2>
                            </div>
                            <div className="ptable-price">
                                <h2>
                                    <small>R$</small>
                                    {goldPricing}
                                    <span>/{currPlanBr}</span>
                                </h2>
                            </div>
                        </div>
                        <div className="ptable-body">
                            <div className="ptable-description">
                                <ul>
                                    <DefaultFeatures />
                                    <li>
                                        {getStatusIcon("on")}{" "}
                                        <span className="font-site text-em-1 text-pill">
                                            sem limites
                                        </span>{" "}
                                        para cadastrar <strong>clientes</strong>{" "}
                                        ao {currPlanBr}
                                    </li>
                                    <li>
                                        {getStatusIcon("on")}{" "}
                                        <span className="font-site text-em-1 text-pill">
                                            sem limites
                                        </span>{" "}
                                        de <strong>membros</strong> conectados{" "}
                                        ao {currPlanBr}
                                    </li>
                                    <li>
                                        {getStatusIcon(isYearly ? "on" : "off")}{" "}
                                        <span className="font-site text-em-1 text-pill">
                                            {isYearly ? "+1" : "sem"} mês extra
                                        </span>{" "}
                                        de uso
                                    </li>
                                    <DefaultFeaturesBottom />
                                </ul>
                            </div>
                        </div>
                        <div className="ptable-footer">
                            <div className="ptable-action">
                                <ButtonFab
                                    title="Ver plano"
                                    position="relative"
                                    backgroundColor="#bfac07"
                                    onClick={() => setCurrPlan("gold")}
                                    variant="extended"
                                    size="large"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="ptable-item featured-item">
                    <div className="ptable-single">
                        <div
                            className="ptable-header text-shadow"
                            style={{
                                background: "rgb(118 111 111)",
                            }}
                        >
                            <div className="ptable-title">
                                <h2 className="text-subtitle">
                                    Prata
                                    {getCrownIcon()}
                                </h2>
                            </div>
                            <div className="ptable-price">
                                <h2>
                                    <small>R$</small>
                                    {silverPricing}
                                    <span>/{currPlanBr}</span>
                                </h2>
                            </div>
                        </div>
                        <div className="ptable-body">
                            <div className="ptable-description">
                                <ul className="font-site">
                                    <DefaultFeatures />
                                    <li>
                                        {getStatusIcon("on")}{" "}
                                        <span className="font-site text-em-1 text-pill">
                                            até {silverMaxClientCredits}
                                        </span>{" "}
                                        cadastros de <strong>clientes</strong>{" "}
                                        ao {currPlanBr}
                                    </li>
                                    <li>
                                        {getStatusIcon("on")}{" "}
                                        <span className="font-site text-em-1 text-pill">
                                            até {silverMaxMemberCredits}
                                        </span>{" "}
                                        <strong>membros conectados</strong> ao{" "}
                                        {currPlanBr}
                                    </li>
                                    <li>
                                        {getStatusIcon(isYearly ? "on" : "off")}{" "}
                                        <span className="font-site text-em-1 text-pill">
                                            {isYearly ? "+1" : "sem"} mês extra
                                        </span>{" "}
                                        de uso
                                    </li>
                                    <DefaultFeaturesBottom />
                                </ul>
                            </div>
                        </div>
                        <div className="ptable-footer">
                            <div className="ptable-action">
                                <ButtonFab
                                    title="Ver plano"
                                    position="relative"
                                    backgroundColor="rgb(118 111 111)"
                                    onClick={() => setCurrPlan("silver")}
                                    variant="extended"
                                    size="large"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="ptable-item">
                    <div className="ptable-single">
                        <div
                            className="ptable-header text-shadow"
                            style={{
                                background: "#a17f73",
                            }}
                        >
                            <div className="ptable-title">
                                <h2 className="text-subtitle">
                                    Bronze
                                    {getCrownIcon()}
                                </h2>
                            </div>
                            <div className="ptable-price">
                                <span className="from">a partir de:</span>
                                <h2>
                                    <small>R$</small>
                                    {bronzePricing}
                                    <span>/{currPlanBr}</span>
                                </h2>
                            </div>
                        </div>
                        <div className="ptable-body">
                            <div className="ptable-description">
                                <ul>
                                    <DefaultFeatures />
                                    <li>
                                        {getStatusIcon("on")}{" "}
                                        <span className="font-site text-em-1 text-pill">
                                            +{bronzeMaxClientCredits}
                                        </span>{" "}
                                        cadastros de <strong>clientes</strong>{" "}
                                        ao {currPlanBr}
                                    </li>
                                    <li>
                                        {getStatusIcon("on")}{" "}
                                        <span className="font-site text-em-1 text-pill">
                                            até {bronzeMaxMemberCredits}
                                        </span>{" "}
                                        <strong>membros</strong> conectados ao{" "}
                                        {currPlanBr}
                                    </li>
                                    <li>
                                        {getStatusIcon("off")}{" "}
                                        <span className="font-site text-em-1 text-pill">
                                            sem mês extra
                                        </span>{" "}
                                        de uso
                                    </li>
                                    <DefaultFeaturesBottom />
                                </ul>
                            </div>
                        </div>
                        <div className="ptable-footer">
                            <div className="ptable-action">
                                <ButtonFab
                                    title="Ver plano"
                                    position="relative"
                                    backgroundColor="#a17f73"
                                    onClick={() => setCurrPlan("bronze")}
                                    variant="extended"
                                    size="large"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <SelectPlanBtns setCurrPlan={setCurrPlan} />
            <style jsx>
                {`
                    .pricing-table {
                        display: flex;
                        flex-flow: row wrap;
                        width: 100%;
                        max-width: 1100px;
                        margin: 0 auto;
                    }

                    .pricing-table .ptable-item {
                        width: 33.33%;
                        padding: 0 15px;
                        margin-bottom: 30px;
                    }

                    @media (max-width: 992px) {
                        .pricing-table .ptable-item {
                            width: 33.33%;
                        }
                    }

                    @media (max-width: 768px) {
                        .pricing-table .ptable-item {
                            width: 50%;
                        }
                    }

                    @media (max-width: 576px) {
                        .pricing-table .ptable-item {
                            width: 100%;
                        }
                    }

                    .pricing-table .ptable-single {
                        position: relative;
                        width: 100%;
                        overflow: hidden;
                    }

                    .pricing-table .ptable-header,
                    .pricing-table .ptable-body,
                    .pricing-table .ptable-footer {
                        position: relative;
                        width: 100%;
                        text-align: center;
                        overflow: hidden;
                    }

                    .pricing-table .ptable-title,
                    .pricing-table .ptable-price,
                    .pricing-table .ptable-description,
                    .pricing-table .ptable-action {
                        position: relative;
                        width: 100%;
                        text-align: center;
                    }

                    .pricing-table .ptable-single {
                        background: var(--mainWhite);
                    }

                    .pricing-table .ptable-header {
                        margin: 0 30px;
                        padding: 20px 0 45px 0;
                        width: auto;
                        background: #2a293e;
                    }

                    .pricing-table .ptable-header::before,
                    .pricing-table .ptable-header::after {
                        content: "";
                        position: absolute;
                        bottom: 0;
                        width: 0;
                        height: 0;
                        border-bottom: 100px solid #f6f8fa;
                    }

                    .pricing-table .ptable-header::before {
                        right: 50%;
                        border-right: 250px solid transparent;
                    }

                    .pricing-table .ptable-header::after {
                        left: 50%;
                        border-left: 250px solid transparent;
                    }

                    .pricing-table .ptable-item.featured-item .ptable-header {
                        background: #ff6f61;
                    }

                    .pricing-table .ptable-title h2 {
                        color: #ffffff;
                        font-size: 24px;
                        font-weight: 300;
                        letter-spacing: 2px;
                    }

                    .pricing-table .ptable-price h2 {
                        margin: 0;
                        color: #ffffff;
                        font-size: 45px;
                        font-weight: 700;
                        margin-left: 15px;
                    }

                    .pricing-table .ptable-price .from {
                        position: absolute;
                        color: #ffffff;
                        font-size: 15px;
                        font-weight: 300;
                        margin-top: -10px;
                        margin-left: -75px;
                    }

                    .pricing-table .ptable-price h2 small {
                        position: absolute;
                        font-size: 25px;
                        font-weight: 500;
                        margin-top: 10px;
                        margin-left: -30px;
                    }

                    .pricing-table .ptable-price h2 span {
                        text-align: left;
                        margin-left: 3px;
                        font-size: 25px;
                        font-weight: 400;
                    }

                    .pricing-table .ptable-body {
                        padding: 20px 0;
                    }

                    .pricing-table .ptable-description ul {
                        margin: 0;
                        font: var(--mainFont);
                        padding: 0;
                        list-style: none;
                        text-align: left;
                    }

                    .pricing-table .ptable-description ul li {
                        color: var(--themeP);
                        font: var(--mainFont);
                        font-size: 20px;
                        font-weight: 400;
                        letter-spacing: 1px;
                        padding: 7px;
                        border-bottom: 1px solid #dedede;
                    }

                    .pricing-table .ptable-description ul li:last-child {
                        border: none;
                    }

                    .pricing-table .ptable-footer {
                        padding-bottom: 30px;
                    }

                    .pricing-table .ptable-action a:hover {
                        color: #2a293e;
                        background: #ff6f61;
                    }

                    .pricing-table .ptable-item.featured-item .ptable-action a {
                        color: #2a293e;
                        background: #ff6f61;
                    }

                    .pricing-table
                        .ptable-item.featured-item
                        .ptable-action
                        a:hover {
                        color: #ff6f61;
                        background: #2a293e;
                    }
                `}
            </style>
        </section>
    );
}

// HELPERS
function getStatusIcon(type) {
    const types = ["on", "off"];
    if (!types.includes(type)) throw new Error("type not allowed");
    const isOk = type === types[0];

    return (
        <FontAwesomeIcon
            icon={isOk ? "check-circle" : "times-circle"}
            style={{
                fontSize: 25,
                color: isOk ? "var(--themeP)" : "var(--expenseRed)",
            }}
            className="ml-2 animated Rubberband delay-2s"
        />
    );
}

function getCrownIcon() {
    return (
        <Fragment>
            <FontAwesomeIcon icon="crown" className="pricing-table-crown" />
            <style jsx>
                {`
                    .pricing-table-crown {
                        position: relative;
                        top: -15px;
                        right: 10px;
                        transform: rotate(40deg);
                        color: #fff;
                        font-size: 23px;
                        filter: drop-shadow(0.5px 0.5px 1.5px black);
                    }
                `}
            </style>
        </Fragment>
    );
}
// END HELPERS

/*
.pricing-table .ptable-status {
  margin-top: -30px;
}

.pricing-table .ptable-status span {
  position: relative;
  display: inline-block;
  border: none;
  width: 50px;
  height: 30px;
  padding: 5px 0;
  text-align: center;
  color: #FF6F61;
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 1px;
  background: #2A293E;
}

.pricing-table .ptable-status span::before,
.pricing-table .ptable-status span::after {
  content: "";
  position: absolute;
  bottom: 0;
  width: 0;
  height: 0;
  border-bottom: 10px solid #FF6F61;
  outline: none;
}

.pricing-table .ptable-status span::before {
  right: 50%;
  border-right: 25px solid transparent;
  outline: none;
}

.pricing-table .ptable-status span::after {
  left: 50%;
  border-left: 25px solid transparent;
}

 */
