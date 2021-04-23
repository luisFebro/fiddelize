import { Fragment } from "react";
import useContext from "context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import getRemainder from "utils/numbers/getRemainder";
import Tooltip from "components/tooltips/Tooltip";
import lStorage, { tooltip1 } from "utils/storage/lStorage";
import { convertDotToComma } from "utils/numbers/convertDotComma";
// circular percentage
import ReactjsPercentageCircle from "components/progressIndicators/ReactjsPercentageCircle/ReactjsPercentageCircle";
import getPercentage from "utils/numbers/getPercentage";
// import { setRun } from '../../redux/actions/globalActions';

// LESSON: if the page does not load and there is no clue what the issue is
// probably is the propTypes which is being called in the former or wrong component.
// check if the component has the same name
// ProgressFragTracker.propTypes = {
//     currScore: PropTypes.number,
//     maxScore: PropTypes.number,
//     playBeep: PropTypes.func,
// };

const options = tooltip1;
const attentionBtnChecked = lStorage("getItem", options);

const getStyles = () => ({
    confettiIcon: {
        fontSize: "20px",
        fontWeight: "normal",
    },
});

export default function ProgressFragTracker() {
    const {
        colorS,
        colorP,
        colorBack,
        currScore,
        // currChall,
        selectTxtStyle,
        maxScore,
        playBeep,
        needAppForPreview,
    } = useContext();

    const eachMilestone = maxScore / 5;
    const currMilestone = getRemainder("tens", currScore, eachMilestone);
    const milestoneLeft = convertDotToComma(eachMilestone - currMilestone);

    const maxLevel = Math.floor(maxScore / eachMilestone);
    let nextLevel = Math.floor(currScore / eachMilestone) + 1;

    const styles = getStyles();

    if (nextLevel > maxLevel) {
        nextLevel = maxLevel;
    }

    const showProgressFragTracker = () => (
        <span
            onClick={() => {
                lStorage("setItem", options);
                playBeep();
            }}
        >
            <ProgressFrag
                needAppForPreview={needAppForPreview}
                selectTxtStyle={selectTxtStyle}
                playBeep={playBeep}
                maxScore={maxScore}
                currScore={currScore}
                colorBack={colorBack}
                colorS={colorS}
                colorP={colorP}
                eachMilestone={eachMilestone}
            />
        </span>
    );

    const showMsg = () => (
        <div className="text-center">
            {!currScore ? null : (
                <Fragment>
                    {currScore >= maxScore ? (
                        <p
                            className={`m-0 mt-5 ${selectTxtStyle(colorBack, {
                                bold: true,
                            })}`}
                        >
                            Você venceu o desafio!{" "}
                            <i style={styles.confettiIcon}>🎉</i>
                        </p>
                    ) : (
                        <p
                            className={`m-0 mt-5 ${selectTxtStyle(colorBack, {
                                bold: true,
                            })}`}
                        >
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
            <div className="container-center">
                {showProgressFragTracker()}
                {showMsg()}
            </div>
        </div>
    );
}

const getStylesProgress = (props) => ({
    percentageCircle: {
        fontFamily: "var(--mainFont)",
        fontSize: props.needResizeFont ? "0.9em" : "text-em-1-3",
        color: props.percentageColor,
    },
    flagIcon: {
        fontSize: "70px",
        padding: "0 5px",
        color: props.selectTxtStyle(props.colorBack, { needDarkBool: true })
            ? "var(--mainDark)"
            : "var(--mainWhite)",
    },
});

function ProgressFrag({
    needAppForPreview,
    selectTxtStyle,
    playBeep,
    maxScore,
    currScore,
    colorBack,
    colorS,
    colorP,
    eachMilestone,
}) {
    const percentageAchieved = getPercentage(maxScore, currScore);
    const needResizeFont = percentageAchieved >= 100;

    const leftScore = currScore >= maxScore ? 0 : maxScore - currScore;

    const percentageColor =
        colorS === "white"
            ? `var(--themePLight--${colorP})`
            : `var(--themeSDark--${colorS})`;

    const styles = getStylesProgress({
        needResizeFont,
        percentageColor,
        selectTxtStyle,
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
            className={`position-relative ${
                needAppForPreview && "enabledLink"
            }`}
            onClick={playBeep}
        >
            <Tooltip
                needArrow
                padding="10px"
                whiteSpace
                width={325}
                needAttentionWaves={!attentionBtnChecked}
                text={`
                    <p class="text-center">DESAFIO DO JOGO</p>
                    Alcançar <strong>${maxScore} Pontos<strong/> com 5 níveis (ícones acima) com ${eachMilestone} pontos cada.
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
                    !currScore ? "(0 pontos)" : `(${currScore} pontos)`
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
                backgroundColor={`var(--themeSDark--${colorS})`}
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
