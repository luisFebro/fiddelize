import ReactjsPercentageCircle from '../../components/progressIndicators/ReactjsPercentageCircle/ReactjsPercentageCircle';
import React, { Fragment } from 'react';
import Tilt from 'react-tilt';
import getPercentage from '../../utils/numbers/getPercentage';
import Tooltip from './Tooltip';
import imgLib, { ImgLoader } from '../../utils/storage/lForageStore';

export default function PercCircleAndGift({
    currScore,
    maxScore,
    showPercentage,
    playBeep,
    colorS,
    colorP,
    classNamePerc, }) {
    const percentageAchieved = getPercentage(maxScore, currScore);
    const needResizeFont = percentageAchieved.toString().includes(".");

    const percentageColor = colorS === "white" ? "var(--themePLight--" + colorP +")" : "var(--themeSDark--" + colorS +")";
    const indicatorBarColor = colorS === "white" ? "var(--themePLight--" + colorP +")" : "var(--themeS--" + colorS +")";

    const styles = {
        percentageCircle: {
            fontFamily: 'var(--mainFont)',
            fontSize: needResizeFont ? '1.0em' : 'text-em-1-3',
            color: percentageColor,
        }
    }

    const displayGift = () => (
        <div className="shake-it">
            {currScore >= maxScore
            ? (
                <div>
                    <p className="mt-3 text-title">Parabéns!<br />Você ganhou um prêmio.</p>
                    <ImgLoader
                        className="app_gift animated bounce shadow-elevation-white"
                        src={imgLib.app_gift}
                        width={100}
                        height="auto"
                        style={{animationIterationCount: 20}}
                    />
                </div>
            ) : (
                <div>
                    <div className="position-relative mt-4">
                        <ImgLoader
                            className="app_gift animated bounce shadow-elevation-white"
                            src={imgLib.app_gift}
                            width={100}
                            height="auto"
                            style={{opacity: '.5'}}
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
                            title={`
                                Você já alcançou
                                <br />
                                <strong>
                                    ${percentageAchieved}% ${!currScore ? "(nenhum ponto)" : `(${currScore} pontos)`}
                                </strong> do
                                <br />
                                desafio até agora.`}
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