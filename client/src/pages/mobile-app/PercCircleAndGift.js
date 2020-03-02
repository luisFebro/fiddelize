import ReactjsPercentageCircle from '../../components/progressIndicators/ReactjsPercentageCircle/ReactjsPercentageCircle';
import React, { Fragment } from 'react';
import Tilt from 'react-tilt';
import getPercentage from '../../utils/numbers/getPercentage';
import { CLIENT_URL } from '../../config/clientUrl';
import Tooltip from './Tooltip';
import '../../keyframes/zoom.css';

const styles = {
    percentageCircle: {
        fontFamily: 'var(--mainFont)',
        fontSize: 'text-em-1-2',
        color: 'var(--themeSDark)'
    }
}

export default function PercCircleAndGift({ userScore, maxScore, showPercentage, playBeep }) {
    const displayGift = () => (
        <div className="shake-it">
            {userScore >= maxScore
            ? (
                <div>
                    <p className="mt-3 text-title">Parabéns!<br />Você ganhou um prêmio.</p>
                    <img
                        className="animated bounce"
                        style={{animationIterationCount: 20}}
                        src={`${CLIENT_URL}/img/icons/pink-gift-box.png`}
                        alt="presente"
                        width={100}
                        height="auto"
                    />
                </div>
            ) : (
                <div>
                    <div className="position-relative mt-4">
                        <img
                            style={{opacity: '.5'}}
                            className="animated bounce"
                            src="/img/icons/pink-gift-box.png"
                            alt="presente"
                            width={100}
                            height="auto"
                        />
                        <p
                            className="text-hero"
                            style={{position: 'absolute', top: '5px', left: '45%'}}
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
                    <div onClick={playBeep}>
                        <Tooltip
                            title={`Você já alcançou<br /><strong>${getPercentage(maxScore, userScore)}% ${!userScore ? "(nenhum ponto)" : `(${userScore} pontos)`}</strong> do<br />objetivo até agora.`}
                            element={
                                <div
                                    className="zoom container-center text-em-2-5 animated zoomIn"
                                >
                                    <ReactjsPercentageCircle
                                        percent={getPercentage(maxScore, userScore)}
                                        radius={70} /*circle size*/
                                        borderWidth={20}
                                        color="var(--themeS)" /*external line color*/
                                        textStyle={styles.percentageCircle}
                                    />
                                </div>
                            }
                        />
                     </div>
                    {displayGift()}
                </Fragment>
            ) : null}
        </div>
    );
}