import { Fragment } from "react";
import CurrentConverter from "./CurrentConverter";
import { addDays } from "../../../../../../../utils/dates/dateFns";
import getCurrMonthBr from "../../../../../../../utils/dates/getMonthNowBr";
import convertToReal from "../../../../../../../utils/numbers/convertToReal";

export default function CashflowContent({ mainData }) {
    const showTitle = () => (
        <div className="my-4">
            <p className="text-subtitle text-purple text-center font-weight-bold">
                Caixa Acumulado
                <br />
                Mensal
            </p>
        </div>
    );

    const lastMonthCash = mainData && mainData.lastMonthCashAmount;
    const currMonthCash = mainData && mainData.allTimeNetProfitAmount;
    const currMonthCashBurn = (lastMonthCash - currMonthCash).toFixed(1);
    // LESSON: the current cash starts with the same value of lastMonthCash
    // and then goes down while there are investiments(outflows) during the month.
    const devisor = currMonthCashBurn === 0 ? 100 : Math.abs(currMonthCashBurn); // 100 just to avoid Infinity and NaN when is devided by zero
    const runawayCashMonthes = Math.round(currMonthCash / devisor);
    const runawayCashDays = !runawayCashMonthes ? 0 : runawayCashMonthes * 30;
    const runawayCashMonthesGoal = 12;
    const isGoalBeated = runawayCashMonthes >= runawayCashMonthesGoal;

    const status = {
        res: currMonthCashBurn <= 0 ? "excelente" : "atenção",
        color: currMonthCashBurn <= 0 ? "text-sys-green" : "text-red",
        backColor:
            currMonthCashBurn <= 0 ? "theme-back--green" : "theme-back--yellow",
        msg: currMonthCashBurn <= 0 ? "custo coberto" : "custo maior",
    };
    const needMinus = status.res === "excelente";

    const gotData = Boolean(mainData && mainData.allTimeNetProfitAmount);
    const currMonth = getCurrMonthBr();
    const lastMonth = getCurrMonthBr(addDays(new Date(), -30));
    const lastMonthRunaway = getCurrMonthBr(
        addDays(new Date(), runawayCashDays)
    );
    const lastYearRunaway = new Date(
        addDays(new Date(), runawayCashDays)
    ).getFullYear();

    const showAccumulatedMonthlyCash = () => (
        <section className="text-purple my-3 d-flex justify-content-around">
            <div className="text-normal text-center font-weight-bold">
                <span
                    className="d-block mb-2 font-site text-em-1-1"
                    style={{
                        lineHeight: "25px",
                    }}
                >
                    Último Mês
                    <br />
                    <span className="text-small font-weight-bold">
                        ({lastMonth})
                    </span>
                </span>
                R$ {convertToReal(lastMonthCash)}
            </div>
            <div className="text-subtitle text-center font-weight-bold">
                <span
                    className="d-block mb-2 font-site text-em-1-1"
                    style={{
                        lineHeight: "25px",
                    }}
                >
                    Mês Atual
                    <br />
                    <span className="text-small font-weight-bold">
                        ({currMonth})
                    </span>
                </span>
                R$ {convertToReal(currMonthCash)}
            </div>
        </section>
    );

    const showCashBurnRate = () => (
        <section className="my-5 container-center">
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
                        Valor Custo
                    </h2>
                </div>
                <p
                    className="text-normal font-weight-bold d-block text-center text-purple"
                    style={{
                        lineHeight: "25px",
                        margin: "20px 0 0",
                    }}
                >
                    Taxa
                    <br />
                    Queima-Dinheiro
                </p>
                <div className="text-title text-center mt-5 mb-4">
                    <span
                        className={`${
                            !gotData ? "text-grey" : status.color
                        } d-inline-block font-size text-em-2`}
                        style={{
                            lineHeight: "30px",
                        }}
                    >
                        <span className="text-em-0-6">
                            {needMinus ? "-" : ""}R$
                        </span>
                        {gotData ? Math.abs(currMonthCashBurn) : "..."}
                    </span>
                </div>
                <p
                    className={`${
                        gotData ? status.backColor : ""
                    } text-shadow text-center text-subtitle font-weight-bold d-table text-pill mb-3`}
                    style={{
                        borderRadius: "0px",
                        margin: "0 auto",
                        lineHeight: "25px",
                    }}
                >
                    {gotData ? status.res : "..."}
                    <br />
                    <span className="text-small font-weight-bold">
                        ({gotData ? status.msg : "..."})
                    </span>
                </p>
            </div>
        </section>
    );

    const showCurrConvertor = () => (
        <Fragment>
            <h2 className="text-center text-normal text-purple font-weight-bold">
                Conversor Agora
            </h2>
            <CurrentConverter />
        </Fragment>
    );

    const showRunawayCash = () => (
        <section className="my-5">
            <h2 className="text-center text-normal text-purple font-weight-bold">
                Previsão
                <br />
                Esgota-Dinheiro
            </h2>
            <p className="font-site text-em-1-1">
                Meta: <strong>{runawayCashMonthesGoal} meses</strong> de
                Esgota-Dinheiro.
            </p>
            <p
                className={`${
                    isGoalBeated ? "text-sys-green" : ""
                } font-site text-em-1-0`}
            >
                {isGoalBeated ? <strong>Meta conquistada!</strong> : ""} Falta{" "}
                <strong>{runawayCashMonthes} meses</strong> ({lastMonthRunaway}{" "}
                de {lastYearRunaway}, daqui a +{runawayCashDays} dias) para
                esgotar dinheiro de caixa a taxa atual.
            </p>
        </section>
    );

    return (
        <section className="mx-3 text-purple">
            {showTitle()}
            {showAccumulatedMonthlyCash()}
            {showCashBurnRate()}
            {showRunawayCash()}
            {showCurrConvertor()}
        </section>
    );
}

/*
<p>
    Capital:
</p>
<p>
    R$ 471,75 - Avenue
</p>
<p>
    R$ 260,00 - Avenue
</p>
<p>
    R$ 52 - Nubank
</p>
<p>
    R$ 50 - Ebanx
</p>
 */
