import { addDays } from "utils/dates/dateFns";
import getCurrMonthBr from "utils/dates/getMonthNowBr";
import convertToReal from "utils/numbers/convertToReal";

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
    const CASH_BURN_MONTHS = 3;
    const diffCash = lastMonthCash - currMonthCash;
    const currMonthCashBurn = Number(
        (
            (diffCash === 0 ? -currMonthCash : diffCash) / CASH_BURN_MONTHS
        ).toFixed(1)
    );

    const runawayCashMonthes = Math.abs(
        Math.round(currMonthCash / currMonthCashBurn)
    ); // if costs are covered which means we have a positive cash flow, the calculation is negative and needs to be abs
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
    const isBreakeven = status.res === "excelente";

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
                <div
                    className={`font-size ${
                        currMonthCashBurn > 999999
                            ? "text-em-1-9 font-weight-bold"
                            : "text-title"
                    } text-center mt-5 mb-4`}
                >
                    <span
                        className={`${
                            !gotData ? "text-grey" : status.color
                        } d-inline-block ${
                            currMonthCashBurn < 999999 && "text-em-2"
                        }`}
                        style={{
                            lineHeight: "30px",
                        }}
                    >
                        <span className="text-em-0-6">
                            {isBreakeven ? "-" : ""}R$
                        </span>
                        {gotData
                            ? convertToReal(Math.abs(currMonthCashBurn))
                            : "..."}
                    </span>
                    {isBreakeven && (
                        <p className="line-height-25 text-sys-green font-site text-em-0-6">
                            caixa atingiu
                            <br />
                            <strong className="text-subtitle font-weight-bold">
                                breakeven
                            </strong>
                            !
                        </p>
                    )}
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
                <p className="text-purple text-normal text-center">
                    Com base <strong>trimestral</strong>
                </p>
            </div>
        </section>
    );

    const showRunawayCash = () => (
        <section className="my-5">
            <h2 className="text-center text-normal text-purple font-weight-bold">
                Previsão
                <br />
                Esgota-Dinheiro
            </h2>
            <p className="font-site text-em-1-1">
                <strong>META:</strong>{" "}
                <strong className="text-pill">
                    +{runawayCashMonthesGoal} meses
                </strong>{" "}
                de distância do Esgota-Dinheiro.
            </p>
            <p
                className={`${
                    isGoalBeated ? "text-sys-green" : ""
                } font-site text-em-1-1`}
            >
                {isGoalBeated ? (
                    <p className="m-0 text-center font-weight-bold">
                        Meta conquistada!
                    </p>
                ) : (
                    ""
                )}
                <strong>ATUAL: </strong>
                <strong>+{runawayCashMonthes} meses</strong> ({lastMonthRunaway}{" "}
                de {lastYearRunaway}, daqui a +{runawayCashDays} dias) para
                <strong>
                    {" "}
                    esgotar dinheiro de caixa atual (R${" "}
                    {convertToReal(currMonthCash)})
                </strong>{" "}
                baseado no custo mensal. Invista a metade no negócio e espere
                recuperar a meta.
            </p>
        </section>
    );

    return (
        <section className="mx-3 text-purple">
            {showTitle()}
            {showAccumulatedMonthlyCash()}
            {showCashBurnRate()}
            {showRunawayCash()}
            <div className="mx-3 my-5 font-site text-em-1-1 text-grey">
                <p className="text-purple text-subtitle">Notas:</p>
                - Cálculo esgota-dinheiro: Cash Runway = Total Cash Reserve /
                Cash Burn Rate
                <br />
                <br />- It’s often best to have a{" "}
                <strong>negative cash burn rate</strong>. That means you are
                building your cash reserves, not using them up. There are
                certainly cases where investing your cash in growth is a good
                idea, though: startups, obviously, but also bootstrapped
                companies that are trying to grow. Just make sure you plan for
                that cash burn and then track your progress.
                <br />
                <br />A good rule of thumb when looking at cash flow is that if
                a business is burning cash too quickly, it risks going out of
                business. On the opposite side, if a business burns cash too
                slowly it may showcase growth stagnation or a lack of investment
                toward the future. For example, say a company started last
                quarter with $200K in the bank but ended with only $110K. That’s
                a loss of $90K in cash over three months—a burn rate of $30K per
                month. From a cash runway perspective, that suggests that the
                company now has just over three months of cash runway or cash on
                hand. They need to lower their burn rate and get cash flow
                positive soon.
            </div>
        </section>
    );
}

/* ARCHIVES

const showCurrConvertor = () => (
    <Fragment>
        <h2 className="text-center text-normal text-purple font-weight-bold">
            Conversor Agora
        </h2>
        <CurrentConverter />
    </Fragment>
);

 */
