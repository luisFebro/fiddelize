import ReactjsPercentageCircle from '../../components/progressIndicators/ReactjsPercentageCircle/ReactjsPercentageCircle';
import React, { Fragment, useState } from 'react';
import getPercentage from '../../utils/numbers/getPercentage';
import Tooltip from '../../components/tooltips/Tooltip';
import GiftBox from './gift-box/GiftBox';
import useDatesCountdown from '../../hooks/dates/useDatesCountdown';
import usePlayAudio from '../../hooks/media/usePlayAudio';

// import Tilt from 'react-tilt';

export default function PercCircleAndGift({
    currScore,
    maxScore,
    rewardDeadline,
    showPercentage,
    playBeep,
    colorS,
    colorP,
    colorBack,
    classNamePerc,
    userName,
    prizeDesc,
    arePrizesVisible,
    currChall,
    userId, }) {
    const [isGiftOpen, setIsGiftOpen] = useState(false);

    usePlayAudio("/sounds/gift-box-opening.mp3", '.gift-box--sound')

    const percentageAchieved = getPercentage(maxScore, currScore);
    const needResizeFont = percentageAchieved.toString().includes(".");
    const leftScore = currScore >= maxScore ? 0 : maxScore - currScore
    const userBeatedChall = currScore >= maxScore;

    const { finalDeadline } = useDatesCountdown({ deadline: rewardDeadline, userId })

    const handleColorSelection = () => {
        if(colorS === "white") {
            return "var(--themePLight--" + colorP +")";
        } else if(colorBack === "black" && colorS === "black") {
            return "var(--themeP--" + colorP + ")";
        } else {
            return "var(--themeS--" + colorS +")";
        }

    }

    const percentageColor = colorS === "white" ? "var(--themePLight--" + colorP +")" : "var(--themeSDark--" + colorS +")";
    const indicatorBarColor = handleColorSelection();

    const styles = {
        percentageCircle: {
            fontFamily: 'var(--mainFont)',
            fontSize: needResizeFont ? '1.0em' : 'text-em-1-3',
            color: percentageColor,
        },
        deadlineBoard: {
            borderRadius: '30px',
            backgroundColor: "var(--themeSDark--" + colorS +")",
            border: '3px solid white',
        },
        timerIcon: {
            top: '-25px',
            left: '-25px',
        },
        deadlineTitle: {
            top: '-25px',
            left: '15px',
        }
    }

    // const Gift =
    // <ImgLoader
    //     className="app_gift  shadow-elevation-white"
    //     width={100}
    //     height="auto"
    //     style={{ opacity: userBeatedChall ? 1 : 0.5 }}
    // />

    const visibleTxt = `
        <p class="text-center">PRÊMIO DO DESAFIO n.º ${currChall}</p>
        • ${userName}, você ganha <strong>${prizeDesc} pontos</strong> ao concluir este desafio.
        <br />
    `;

    const hiddenTxt = `
        <p class="text-center">PRÊMIO DO DESAFIO n.º ${currChall}</p>
        • ${userName}, o prêmio é uma surpresa e será revelado assim que este desafio for concluído.
        <br />
    `;
    const tooltipTxt = arePrizesVisible ? visibleTxt : hiddenTxt;

    const plural = finalDeadline > 1 ? "s" : "";
    const showPrizeDeadline = () => (
        <section
            className="position-absolute animated zoomIn delay-3s"
            style={{zIndex: 2000, bottom: '5%', left: '66%', display: isGiftOpen ? "block" : "none"}}
        >
            <div className="position-relative">
                <div style={styles.deadlineBoard}>
                    {!finalDeadline
                    ? (
                        <p className="m-0 mx-3 text-subtitle text-white text-shadow text-center text-nowrap">
                            ... dias
                        </p>
                    ) : (
                        <p className="m-0 mx-3 text-subtitle text-white text-shadow text-center text-nowrap">
                            {finalDeadline === 0 ? `expirou` : `${finalDeadline} dia${plural}`}
                        </p>
                    )}
                </div>
                <p
                    className="text-small text-center font-weight-bold position-absolute text-nowrap"
                    style={styles.deadlineTitle}
                >
                    Prazo Resgate
                </p>
                <div className="position-absolute" style={styles.timerIcon}>
                    <img
                        className="shadow-elevation-white"
                        src="/img/icons/timer.svg"
                        alt="relógio"
                        width={45}
                        height={45}
                    />
                </div>
            </div>
        </section>
    );

    const showCircularProgress = () => (
        <section
            className={classNamePerc}
            onClick={playBeep}
        >
            <Tooltip
                needArrow
                text={`
                    Você já alcançou
                    <br />
                    <strong>
                        ${percentageAchieved}% ${!currScore ? "(nenhum ponto)" : `(${currScore} pontos)`}
                    </strong> do
                    <br />
                    desafio até agora. <strong>Falta ${leftScore} pontos.</strong>`}
                element={
                    <div
                        className="zoom-it container-center text-em-2-5 animated zoomIn"
                    >
                        <ReactjsPercentageCircle
                            percent={percentageAchieved}
                            radius={75} /*circle size*/
                            borderWidth={20}
                            color={indicatorBarColor} /*external line color*/
                            textStyle={styles.percentageCircle}
                        />
                    </div>
                }
                backgroundColor={"var(--themeSDark--" + colorS + ")"}
            />
         </section>
    );

    const showGift = () => {
        const displayGiftBox = ({ needSmallBox }) => (
            <GiftBox
                className="gift-box--sound"
                boxSColor={colorS}
                boxPColor={colorP}
                callback={setIsGiftOpen}
                needSmallBox={needSmallBox}
                prizeDesc={prizeDesc}
            />
        );

        const challengeInProgress = () => (
            <section className={!arePrizesVisible ? "shake-it" : ""}>
                <div className="position-relative mt-5">
                    <Tooltip
                        needArrow
                        whiteSpace
                        width={325}
                        text={tooltipTxt}
                        element={displayGiftBox({ needSmallBox: true })}
                        backgroundColor={"var(--themeS--" + colorS +")"}
                    />
                    <p
                        className="text-hero"
                        style={{position: 'absolute', top: '5px', left: '50%', transform: 'translateX(-50%)'}}
                    >
                        ?
                    </p>
                </div>
            </section>
        );

        const beatedChallenge = () => (
            <section>
                <p className="text-title text-shadow my-4 mb-5">
                    Parabéns, {userName}!
                    <br />
                    <span style={{fontSize: '28px'}}>Abra seu prêmio.</span>

                </p>
                <section className="d-block animated bounce repeat-2 delay-1s position-relative pt-5">
                    {displayGiftBox({ needSmallBox: false })}
                    {showPrizeDeadline()}
                </section>
            </section>
        );

        return(
            <Fragment>
                {userBeatedChall ? beatedChallenge() : challengeInProgress()}
            </Fragment>
        );
    }

    return(
        <div className="my-3 text-white text-center">
            {showPercentage
            ? (
                <Fragment>
                    {showCircularProgress()}
                    {showGift()}
                </Fragment>
            ) : null}
        </div>
    );
}