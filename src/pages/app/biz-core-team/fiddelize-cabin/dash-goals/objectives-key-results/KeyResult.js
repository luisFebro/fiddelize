import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PercLinearProgress from "components/progressIndicators/perc-linear-progress/PercLinearProgress";
import getPercentage from "utils/numbers/getPercentage";
import parse from "html-react-parser";

export default function KeyResult({
    currKR = 0,
    goalKR = 0,
    krKeyword = "cliente",
    customTitle,
    needWinPerc = true,
}) {
    const plural = currKR > 1 ? "s" : "";

    const perc = getPercentage(goalKR, currKR, { moreThan100: true });

    const finishedKR = perc >= 100;

    const mainTitle = customTitle
        ? parse(customTitle)
        : `${Number.isNaN(currKR) ? "..." : currKR} ${krKeyword}${plural}`;

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
                        {parse(customTitle) || mainTitle}{" "}
                        {needWinPerc ? `(+${perc > 100 ? perc : "100"} %)` : ""}
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
                    {mainTitle}
                    <br />
                    <span className="text-normal">{perc}% concluído</span>
                </h4>
            )}
            <PercLinearProgress
                perc={finishedKR ? 100 : perc}
                color={finishedKR ? "green" : "var(--themeP)"}
            />
        </Fragment>
    );
}
