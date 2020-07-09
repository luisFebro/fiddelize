import ReactjsPercentageCircle from '../../components/progressIndicators/ReactjsPercentageCircle/ReactjsPercentageCircle';
import React, { Fragment } from 'react';
import getPercentage from '../../utils/numbers/getPercentage';
import Tooltip from '../../components/tooltips/Tooltip';
import imgLib, { ImgLoader } from '../../utils/storage/lForageStore';
import PrizesBtn from '../../pages/dashboard-client-admin/dash-clients/clients-history/card-hidden-content/modal-content-pages/prizes-gallery/PrizesBtn';
// import Tilt from 'react-tilt';

const truncate = (name, leng) => window.Helper.truncate(name, leng);

export default function PercCircleAndGift({
    currScore,
    maxScore,
    showPercentage,
    playBeep,
    colorS,
    colorP,
    colorBack,
    classNamePerc,
    userName,
    prizeDesc,
    arePrizesVisible,
    currChall, }) {
    const percentageAchieved = getPercentage(maxScore, currScore);
    const needResizeFont = percentageAchieved.toString().includes(".");
    const leftScore = currScore >= maxScore ? 0 : maxScore - currScore
    const userBeatedChall = currScore >= maxScore;

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
        }
    }

    const Gift =
    <ImgLoader
        className="app_gift animated bounce shadow-elevation-white"
        src={imgLib.app_gift}
        width={100}
        height="auto"
        style={{ opacity: userBeatedChall ? 1 : 0.5 }}
    />

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

    const showPrizesBtn = () => (
        <div className="position-absolute center-to-img">
            <PrizesBtn
                colorS={colorS}
                title = "Abrir"
                top = {0}
                shadowColor = 'white'
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
                        {Gift}
                        {showPrizesBtn()}
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
                            element={Gift}
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