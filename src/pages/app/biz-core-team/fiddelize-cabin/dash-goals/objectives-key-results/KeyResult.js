import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PercLinearProgress from "components/progressIndicators/perc-linear-progress/PercLinearProgress";
import getPercentage from "utils/numbers/getPercentage";

export default function KeyResult({ kr, krKeyword = "cliente", currKR = 0 }) {
    const plural = currKR > 1 ? "s" : "";
    const perc = getPercentage(kr, currKR, { moreThan100: true });
    const finishedKR = perc >= 100;
    const currKr = `${
        Number.isNaN(currKR) ? "..." : currKR
    } ${krKeyword}${plural}`;

    return (
        <Fragment>
            <div className="position-relative">
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
