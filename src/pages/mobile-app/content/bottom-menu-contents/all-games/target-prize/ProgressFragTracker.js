import { Fragment } from "react";
import useContext from "context";
import useData from "init";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import getRemainder from "utils/numbers/getRemainder";
import Tooltip from "components/tooltips/Tooltip";
import getItems, { setItems } from "init/lStorage";
import { convertDotToComma } from "utils/numbers/convertDotComma";
// circular percentage
import ReactjsPercentageCircle from "components/progressIndicators/ReactjsPercentageCircle/ReactjsPercentageCircle";
import getPercentage from "utils/numbers/getPercentage";
import getColor from "styles/txt";

// LESSON: if the page does not load and there is no clue what the issue is
// probably is the propTypes which is being called in the former or wrong component.
// check if the component has the same name
// ProgressFragTracker.propTypes = {
//     currPoints: PropTypes.number,
//     targetPoints: PropTypes.number,
//     playBeep: PropTypes.func,
// };

const collection = "onceChecked";
const [needFlagWaves] = getItems(collection, ["tooltipState"]);

const getStyles = () => ({
    confettiIcon: {
        fontSize: "20px",
        fontWeight: "normal",
    },
});

export default function ProgressFragTracker() {
    const { currPoints = 100, adminGame } = useData();
    const {
        playBeep,
        targetPointsPreview,
        needAppForPreview,
        themeSColor: colorS,
        themePColor: colorP,
        themeBackColor: colorBack,
        txtColor,
    } = useContext();

    const targetPoints =
        targetPointsPreview ||
        (adminGame.targetPrize && adminGame.targetPrize.targetPoints);

    const eachMilestone = targetPoints / 5;
    const currMilestone = getRemainder("tens", currPoints, eachMilestone);
    const milestoneLeft = convertDotToComma(eachMilestone - currMilestone);

    const maxLevel = Math.floor(targetPoints / eachMilestone);
    let nextLevel = Math.floor(currPoints / eachMilestone) + 1;

    const styles = getStyles();

    if (nextLevel > maxLevel) {
        nextLevel = maxLevel;
    }

    const showProgressFragTracker = () => (
        <ProgressFrag
            needAppForPreview={needAppForPreview}
            playBeep={playBeep}
            targetPoints={targetPoints}
            currPoints={currPoints}
            colorBack={colorBack}
            colorS={colorS}
            colorP={colorP}
            eachMilestone={eachMilestone}
        />
    );

    const showMsg = () => (
        <div className="text-center">
            {!currPoints ? null : (
                <Fragment>
                    {currPoints >= targetPoints ? (
                        <p className={`m-0 mt-5 ${txtColor}`}>
                            Você venceu o desafio!{" "}
                            <i style={styles.confettiIcon}>🎉</i>
                        </p>
                    ) : (
                        <p className={`m-0 mt-5 ${txtColor}`}>
                            {nextLevel === 5 ? (
                                <span className="text-left">
                                    Opa! Falta mais{" "}
                                    <strong>{milestoneLeft} pontos</strong> para
                                    concluir desafio atual e ganhar seu prêmio.
                                </span>
                            ) : (
                                <span>
                                    <strong>+ {milestoneLeft} pontos</strong>{" "}
                                    para nível {nextLevel}.
                                </span>
                            )}
                        </p>
                    )}
                </Fragment>
            )}
        </div>
    );

    return (
        <div className="text-normal text-white text-center">
            <div className="container-center-col">
                {showProgressFragTracker()}
                {showMsg()}
            </div>
        </div>
    );
}

const getStylesProgress = (props) => ({
    percentageCircle: {
        fontFamily: "var(--mainFont)",
        fontSize: props.needResizeFont ? "37px" : "text-em-1-3",
        color: props.percentageColor,
    },
    flagIcon: {
        fontSize: "70px",
        padding: "0 5px",
        color: getColor(props.colorBack).needDark
            ? "var(--mainDark)"
            : "var(--mainWhite)",
    },
});

function ProgressFrag({
    needAppForPreview,
    playBeep,
    targetPoints,
    currPoints,
    colorBack,
    colorS,
    colorP,
    eachMilestone,
}) {
    const percentageAchieved = getPercentage(targetPoints, currPoints);
    const needResizeFont =
        percentageAchieved >= 100 ||
        percentageAchieved.toString().includes("."); // for fractional numbers like 85.45%

    const leftScore =
        currPoints >= targetPoints ? 0 : targetPoints - currPoints;

    const percentageColor =
        colorS === "white"
            ? `var(--themePLight--${colorP})`
            : `var(--themeSDark--${colorS})`;

    const styles = getStylesProgress({
        needResizeFont,
        percentageColor,
        colorBack,
    });

    const indicatorBarColor = handleColorSelection({
        colorBack,
        colorS,
        colorP,
    });

    const showFlag = () => (
        <div
            className="position-absolute"
            style={{
                top: -63,
                left: "80%",
                transform: "translateX(-80%)",
                zIndex: 100,
            }}
        >
            <i>
                <FontAwesomeIcon
                    icon="flag-checkered"
                    style={styles.flagIcon}
                />
            </i>
        </div>
    );

    return (
        <section
            className={`animated fadeInUp delay-2s position-relative ${
                needAppForPreview && "enabledLink"
            }`}
            onClick={() => {
                setItems(collection, { tooltipState: true });
                playBeep();
            }}
        >
            <Tooltip
                needArrow
                padding="10px"
                whiteSpace
                width={325}
                needAttentionWaves={!needFlagWaves}
                text={`
                    <p class="text-center">DESAFIO DO JOGO</p>
                    Alcançar <strong>${targetPoints} Pontos<strong/> com 5 níveis (ícones acima) com ${eachMilestone} pontos cada.
                `}
                element={showFlag()}
                backgroundColor={`var(--themeSDark--${colorS})`}
                colorS={colorS}
            />
            <Tooltip
                padding="10px"
                whiteSpace
                width={325}
                needArrow
                text={`
                    <p class="text-center">PROGRESSO</p>
                    Você já alcançou <strong>
                        ${percentageAchieved}% ${
                    !currPoints ? "(0 pontos)" : `(${currPoints} pontos)`
                }
                    </strong> do desafio até agora. <span class="text-em-1-1"><br /><br />Faltam ${leftScore} pontos.</span>`}
                element={
                    <div className="zoom-it container-center text-em-2-5">
                        <ReactjsPercentageCircle
                            percent={percentageAchieved}
                            radius={75} /* circle size */
                            borderWidth={20}
                            color={indicatorBarColor} /* external line color */
                            textStyle={styles.percentageCircle}
                        />
                    </div>
                }
                backgroundColor={`var(--themeS--${colorS})`}
                colorS={colorS}
            />
        </section>
    );
}

// HELPERS
function handleColorSelection({ colorP, colorS, colorBack }) {
    if (colorS === "white") {
        return `var(--themePLight--${colorP})`;
    }
    if (colorBack === "black" && colorS === "black") {
        return `var(--themeP--${colorP})`;
    }
    return `var(--themeS--${colorS})`;
}
// END HELPERS
