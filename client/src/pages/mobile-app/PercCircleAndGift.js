import ReactjsPercentageCircle from '../../components/progressIndicators/ReactjsPercentageCircle/ReactjsPercentageCircle';
import React, { Fragment, useEffect, useState } from 'react';
import getPercentage from '../../utils/numbers/getPercentage';
import Tooltip from '../../components/tooltips/Tooltip';
import PrizesBtn from '../../pages/dashboard-client-admin/dash-clients/clients-history/card-hidden-content/modal-content-pages/prizes-gallery/PrizesBtn';
import useAPI, { readPrizes } from '../../hooks/api/useAPI';
import { addDays } from '../../utils/dates/dateFns';
import getDiffDays from '../../utils/dates/getDiffDays';
import GiftBox from './gift-box/GiftBox';

// import Tilt from 'react-tilt';

const truncate = (name, leng) => window.Helper.truncate(name, leng);

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
    const [finalDeadline, setFinalDeadline] = useState("...");
    const percentageAchieved = getPercentage(maxScore, currScore);
    const needResizeFont = percentageAchieved.toString().includes(".");
    const leftScore = currScore >= maxScore ? 0 : maxScore - currScore
    const userBeatedChall = currScore >= maxScore;

    const { data: lastPrizeDate, loading, } = useAPI({ url: readPrizes(userId), params: { lastPrizeDate: true } });

    useEffect(() => {
        const targetDate = addDays(new Date(lastPrizeDate), rewardDeadline + 1);
        const res = targetDate ? getDiffDays(targetDate) : "...";
        setFinalDeadline(Number.isNaN(res) ? "..." : res);
    }, [lastPrizeDate, rewardDeadline])

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
    //     className="app_gift animated bounce shadow-elevation-white"
    //     src={imgLib.app_gift}
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
            className="position-absolute"
            style={{top: '5px', left: '65%'}}
        >
            <div className="position-relative">
                <div style={styles.deadlineBoard}>
                    {(loading || finalDeadline > 365)
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

    const showPrizesBtn = () => (
        <div
            className="position-absolute"
            style={{bottom: '5px', left: '57%'}}
        >
            <PrizesBtn
                colorS={colorS}
                title= "Abrir"
                top= {0}
                shadowColor= 'white'
            />
        </div>
    );

    const displayGift = () => (
        <div className="shake-it">
            {userBeatedChall
            ? (
                <section>
                    <p className="text-subtitle text-shadow mt-3 text-title">
                        Parabéns, {userName}!
                        <br />
                        Você ganhou
                        <span className="text-title"> {truncate(prizeDesc, 20)}</span>.
                    </p>
                    <div className="position-relative">
                        <GiftBox />
                        {showPrizesBtn()}
                        {showPrizeDeadline()}
                    </div>
                </section>
            ) : (
                <div>
                    <div className="position-relative mt-4">
                        <Tooltip
                            needArrow
                            whiteSpace
                            width={325}
                            text={tooltipTxt}
                            element={<GiftBox />}
                            backgroundColor={"var(--themeS--" + colorS +")"}
                        />
                        <p
                            className="text-hero"
                            style={{position: 'absolute', top: '5px', left: '50%', transform: 'translateX(-50%)'}}
                        >
                            ?
                        </p>
                    </div>
                </div>
            )}
        </div>
    );

    return(
        <div className="my-3 text-white text-center">
            {showPercentage
            ? (
                <Fragment>
                    <div
                        className={classNamePerc}
                        onClick={playBeep}>
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
                     </div>
                    {displayGift()}
                </Fragment>
            ) : null}
        </div>
    );
}