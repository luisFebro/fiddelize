import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import parse from "html-react-parser";
import PercLinearProgress from "../../../../../../components/progressIndicators/perc-linear-progress/PercLinearProgress";
import getPercentage from "../../../../../../utils/numbers/getPercentage";
import {
    startWeek,
    endWeek,
    formatDMY,
} from "../../../../../../utils/dates/dateFns";

export default function OKR({ weeklyNewCustomers }) {
    // const endDate = "23 de junho";
    const showObjective = (
        goal = "consolidar serviços Fiddelize com primeiros <strong>10 clientes pro</strong> em um dos planos"
    ) => (
        <section className="mb-5 text-purple">
            <h2 className="text-subtitle font-weight-bold">
                <p className="text-subtitle font-weight-bold text-center">
                    Objetivo Mensal:
                </p>
                <span
                    className="text-normal d-inline-block"
                    style={{
                        lineHeight: "30px",
                    }}
                >
                    {parse(goal)}
                </span>
            </h2>
        </section>
    );

    const startWeekDay = formatDMY(new Date(startWeek), false, false);
    const endWeekDay = formatDMY(new Date(endWeek), false, false);
    const today = formatDMY(new Date(), false, false);
    return (
        <section className="mt-5 mx-2">
            {showObjective()}
            <Fragment>
                <h2
                    className="text-purple text-subtitle font-weight-bold text-center"
                    style={{ lineHeight: "30px" }}
                >
                    Resultado-Chave
                    <br />
                    Semana Atual:
                </h2>
                <KeyResult
                    krDesc="atingir os primeiros <br /><strong>5 clientes pro</strong>"
                    krKeyword="cliente"
                    kr={5}
                    curr={weeklyNewCustomers}
                    mt={false}
                />
            </Fragment>
            <section className="mt-2 d-flex justify-content-between">
                <p className="m-0 text-purple text-small font-weight-bold">
                    Começa:
                    <br />
                    {startWeekDay}
                </p>
                <p className="text-purple text-small font-weight-bold">
                    Termina:
                    <br />
                    {endWeekDay}
                </p>
            </section>
            <p className="my-3 text-small text-center text-purple font-weight-bold">
                Hoje é {today}
            </p>
        </section>
    );
}

function KeyResult({ krDesc, krKeyword, kr = 0, curr = 0, mt = true }) {
    const plural = curr > 1 ? "s" : "";
    const perc = getPercentage(kr, curr, { moreThan100: true });
    const finishedKR = perc >= 100;
    const currKr = `${curr} ${krKeyword}${plural}`;

    return (
        <Fragment>
            <div className="position-relative">
                <h3
                    className={`${
                        mt ? "mt-5" : ""
                    } position-relative text-normal text-pill text-center`}
                    style={{
                        padding: "10px 15px",
                        bottom: -20,
                    }}
                >
                    {parse(krDesc)}
                </h3>
                {finishedKR && (
                    <div
                        className="position-absolute animated rubberBand"
                        style={{
                            bottom: -10,
                            right: 0,
                        }}
                    >
                        <FontAwesomeIcon
                            icon="check"
                            style={{
                                fontSize: "45px",
                                color: "var(--incomeGreen)",
                            }}
                        />
                    </div>
                )}
            </div>
            {finishedKR ? (
                <h4
                    className="position-relative text-center text-normal font-weight-bold text-sys-green"
                    style={{
                        bottom: -20,
                    }}
                >
                    <span className="text-subtitle font-weight-bold">
                        {perc > 100 ? perc : "100"}% - {currKr}
                    </span>
                    <br />
                    Resultado atingido!
                </h4>
            ) : (
                <h4
                    className="my-3 position-relative font-weight-bold text-center text-subtitle text-purple"
                    style={{
                        bottom: -20,
                        lineHeight: "25px",
                    }}
                >
                    {currKr}
                    <br />
                    <span className="text-normal">{perc}% concluído</span>
                </h4>
            )}
            <PercLinearProgress perc={finishedKR ? 100 : perc} />
        </Fragment>
    );
}

/*
{showKR({
    krDesc:
        "atingir os primeiros <br /><strong>500 clientes</strong>",
    krNum: 500,
    curr: 100,
    mt: true,
})}
 */
