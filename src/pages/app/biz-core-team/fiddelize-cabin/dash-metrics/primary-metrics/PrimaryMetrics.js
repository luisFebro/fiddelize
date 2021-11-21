import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAPI, { readFiddelizeCosts } from "api/useAPI";
import convertToReal from "utils/numbers/convertToReal";
import getPercentage from "utils/numbers/getPercentage";
import getMonthNowBr from "utils/dates/getMonthNowBr";
import InstructionBtn from "components/buttons/InstructionBtn";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import RevenueHistoryBtn from "./revenue-history/RevenueHistoryBtn";
import MonthlyCostRegisterBtn from "./monthly-cost-register/MonthlyCostRegisterBtn";
import CashflowBtn from "./cash-flow/CashflowBtn";

export default function PrimaryMetrics({ mainData }) {
    const [newCostValue, setNewCostValue] = useState(0);
    const [revenueMode, setRevenueMode] = useState("netProfit"); //or allTimeRevenue
    const revenueAmount = mainData && mainData.revenueAmount;

    const allTimeRevenueAmount = mainData && mainData.allTimeRevenueAmount;
    const allTimeCashAmount = mainData && mainData.allTimeCashAmount;

    const { data, loading } = useAPI({
        url: readFiddelizeCosts(),
        params: {
            amount: true,
        },
    });

    const finalTotalCost =
        (data && data.transactionsAmount) || newCostValue
            ? data.transactionsAmount + newCostValue
            : 0;

    const monthlyCosts = loading ? "..." : finalTotalCost;
    const profitValue = revenueAmount - monthlyCosts; // Margem  = ( Lucro / Vendas ) * 100

    let netProfitMargin = getPercentage(revenueAmount, profitValue); // ((profitValue / revenue) * 100).toFixed(1)
    netProfitMargin = netProfitMargin < 0 ? 0 : netProfitMargin;

    const currMonth = getMonthNowBr();
    const gotData = revenueAmount || revenueAmount === 0;

    const {
        color: colorNetProfitMargin,
        status,
        backColor: backNetProfitMargin,
    } = getColorStatusData(netProfitMargin);

    async function handleNewCostValue(newValue) {
        setNewCostValue((prevValue) => prevValue + newValue);
    }

    const showRevenueAndCost = ({ currMonth }) => (
        <section className="d-flex text-purple justify-content-between mx-3">
            <div className="text-normal font-weight-bold">
                <span className="font-site text-em-1-1">Vendas</span>
                <br />
                {gotData
                    ? convertToReal(revenueAmount, { moneySign: true })
                    : "R$ ..."}
            </div>
            <div className="position-relative text-normal font-weight-bold">
                <span className="font-site text-em-1-1">Custos</span>
                <br />
                {monthlyCosts === "..."
                    ? "..."
                    : convertToReal(monthlyCosts, { moneySign: true })}
                <MonthlyCostRegisterBtn
                    currMonth={currMonth}
                    handleNewCostValue={handleNewCostValue}
                    mainData={mainData}
                />
            </div>
        </section>
    );

    const displayParamsBtn = () => {
        const txt = `
            <p class="text-center">PARÂMETROS</p>
            <p>>= 20% - Excelente</p>
            <p>>= 10% - Ótimo</p>
            <p>> 0% - Bom</p>
            <p>< 0% - Ruim</p>
        `;

        return (
            <div
                className="position-absolute"
                style={{
                    bottom: -15,
                    left: "60%",
                    transform: "translateX(-60%)",
                }}
            >
                <InstructionBtn text={txt} mode="tooltip" animated />
            </div>
        );
    };

    const showProfit = () => (
        <section className="position-relative my-5 container-center">
            <div
                style={{
                    borderRadius: "20px",
                    padding: "10px",
                    backgroundColor: "var(--mainWhite)",
                    minWidth: 175,
                }}
                className="shadow-babadoo position-relative"
            >
                <div
                    className="position-absolute text-nowrap"
                    style={{
                        top: -20,
                        left: "50%",
                        transform: "translateX(-50%)",
                    }}
                >
                    <h2 className="text-pill text-center text-subtitle font-weight-bold text-white">
                        {profitValue > 0 ? "Lucro" : "Perca"}
                    </h2>
                </div>
                <p
                    className="text-normal font-weight-bold d-block text-center text-purple"
                    style={{
                        lineHeight: "25px",
                        margin: "20px 0 0",
                    }}
                >
                    Margem Líquida
                </p>
                <div className="text-title text-center mt-5 mb-4">
                    <span
                        className={`${
                            !gotData ? "text-grey" : colorNetProfitMargin
                        } d-inline-block font-size text-em-2`}
                        style={{
                            lineHeight: "30px",
                        }}
                    >
                        {gotData ? netProfitMargin : "..."}
                        <span className="text-em-0-6">%</span>
                        <br />
                        <span className="font-size text-em-0-5">
                            {gotData
                                ? convertToReal(profitValue, {
                                      moneySign: true,
                                  })
                                : "R$ ..."}
                        </span>
                    </span>
                </div>
                <p
                    className={`${
                        gotData ? backNetProfitMargin : ""
                    } text-shadow text-center text-subtitle font-weight-bold d-table text-pill mb-3`}
                    style={{ borderRadius: "0px", margin: "0 auto" }}
                >
                    {gotData ? status : "..."}
                </p>
            </div>
            {displayParamsBtn()}
        </section>
    );

    const displayChangeModeBtn = () => (
        <ButtonFab
            position="relative"
            backgroundColor="var(--themeSDark)"
            iconFontAwesome={
                <FontAwesomeIcon
                    icon="sync-alt"
                    className="d-flex align-items-center"
                    style={{ fontSize: 25 }}
                    needIconShadow={false}
                    onClick={() => {
                        let thisChange = "";
                        if (revenueMode === "netProfit") {
                            thisChange = "allTimeRevenue";
                        } else {
                            thisChange = "netProfit";
                        }
                        setRevenueMode(thisChange);
                    }}
                />
            }
        />
    );

    const displayMoreOptBtn = () => <CashflowBtn mainData={mainData} />;

    const handleRevenueColor = () => {
        if (revenueMode === "netProfit") {
            return allTimeCashAmount <= 0 ? "text-red" : "text-sys-green";
        }
        return allTimeRevenueAmount <= 0 ? "text-red" : "text-sys-green";
    };

    const showTotalRevenue = () => (
        <section className="my-3 text-purple text-center">
            <h2 className="m-0 text-normal font-weight-bold">
                {revenueMode === "netProfit"
                    ? "Caixa Disponível "
                    : "Receita Geral Total "}
                <div style={{ display: "inline-flex" }}>
                    {displayChangeModeBtn()}
                    {revenueMode === "netProfit" ? (
                        <section className="position-relative animated fadeIn">
                            {displayMoreOptBtn()}
                            <div
                                className="position-absolute"
                                style={{
                                    top: -20,
                                    right: -50,
                                }}
                            >
                                <div className="position-relative text-purple">
                                    <p
                                        className="text-nowrap font-weight-bold position-absolute text-normal text-purple"
                                        style={{
                                            top: -25,
                                            right: 10,
                                        }}
                                    >
                                        Burn Rate
                                    </p>
                                    <img
                                        src="/img/icons/curve-arrow-left-purple.svg"
                                        width={40}
                                        height={40}
                                        alt="seta"
                                        style={{
                                            transform: "rotate(-20deg)",
                                        }}
                                    />
                                </div>
                            </div>
                        </section>
                    ) : undefined}
                </div>
            </h2>
            {gotData ? (
                <p
                    className={`m-0 ${handleRevenueColor()} text-subtitle font-weight-bold`}
                >
                    R${" "}
                    {convertToReal(
                        revenueMode === "netProfit"
                            ? allTimeCashAmount - newCostValue
                            : allTimeRevenueAmount
                    )}
                </p>
            ) : (
                <p
                    className={`m-0 ${
                        allTimeRevenueAmount < 0 ? "text-red" : "text-sys-green"
                    } text-subtitle font-weight-bold`}
                >
                    R$ ...
                </p>
            )}
        </section>
    );

    return (
        <section>
            <h2 className="text-purple text-subtitle font-weight-bold text-center">
                Receita Mensal Atual
                <br />
                (- {currMonth} -)
            </h2>
            {showRevenueAndCost({ currMonth })}
            {showProfit()}
            {showTotalRevenue()}
            <section className="my-5 container-center">
                <RevenueHistoryBtn />
            </section>
        </section>
    );
}

function getColorStatusData(profitValue) {
    if (profitValue <= 0)
        return {
            color: "text-red",
            backColor: "theme-back--red",
            status: "RUIM",
        };
    if (profitValue > 0 && profitValue < 10)
        return {
            color: "text-yellow",
            backColor: "theme-back--yellow",
            status: "BOM",
        };
    if (profitValue >= 10 && profitValue < 20)
        return {
            color: "text-alt-green",
            backColor: "theme-back--green",
            status: "ÓTIMO",
        };
    if (profitValue >= 20)
        return {
            color: "text-sys-green",
            backColor: "theme-back--green",
            status: "EXCELENTE",
        };

    return;
}
