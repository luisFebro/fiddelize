import React from 'react';
import { convertDotToComma } from '../../utils/numbers/convertDotComma';
import PurchaseHistoryBtn from './history-purchase-btn/PurchaseHistoryBtn';

const AllScores = ({
    currScoreRef,
    currScore,
    userId,
    showPercentage,
    lastScore,
    needAppForPreview,
    selectTxtStyle,
    colorBack,
    colorS,
    totalGeneralScore,
    totalPurchasePrize,
    userName,
}) => {

    const getModalData = () => ({
        cliUserName: userName,
        cliUserId: userId,
        currUserScore: currScore,
        totalGeneralScore,
        totalPurchasePrize,
    });

    lastScore = convertDotToComma(lastScore);
    const modalData = getModalData();
    const selectedTxtStyle = selectTxtStyle(colorBack, {bold: true});

    return(
        <section className="text-subtitle my-3 text-white text-center">
            <span className={`text-title ${selectedTxtStyle}`}>
                Fidelidômetro:
            </span>
            <br/>
            <div className="d-flex justify-content-center">
                <p
                    className={`text-title ${selectedTxtStyle}`}
                    ref={currScoreRef}
                >
                    ...
                </p>
                <span className={`ml-2 ${selectedTxtStyle}`}>
                    Pontos
                </span>
            </div>
            {/*LAST SCORE*/}
            {currScore === 0 || !currScore || !showPercentage
             ? null
             : (
                <section className="text-normal position-relative animated slideInLeft slow">
                    <section>
                        <div className="all-scores--ellipse">
                            <div className="body" style={{ left: needAppForPreview && '160px'}}></div>
                            <PurchaseHistoryBtn
                                bottom={-15}
                                right={-5}
                                colorS={colorS}
                                modalData={modalData}
                            />
                        </div>
                    </section>
                    <div
                        style={{
                            zIndex: 10,
                            lineHeight: '1.2em',
                            color: 'var(--themeP)',
                            position: 'absolute',
                            top: '-18px',
                            left: needAppForPreview ? '170px' : '200px'}}
                        className="text-em-0-7 text-nowrap font-weight-bold"
                    >
                        Sua<br />última pontuação:<br />
                        <span className="text-em-1-3">
                            {lastScore}
                        </span>
                    </div>
                </section>
            )}
        </section>
    );
}

export default AllScores;
