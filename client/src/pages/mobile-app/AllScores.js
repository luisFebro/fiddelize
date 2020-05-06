import React from 'react';
import { convertDotToComma } from '../../utils/numbers/convertDotComma';

const AllScores = ({
    currScoreRef,
    currScore,
    showPercentage,
    lastScore,
    needAppForPreview,
    selectTxtStyle,
    colorBack, }) => (
    <div className="text-subtitle my-3 text-white text-center">
        <span className={`text-title ${selectTxtStyle(colorBack, {bold: true})}`}>
            Fidelidômetro:
        </span>
        <br/>
        <div className="d-flex justify-content-center">
            <p className={`text-title ${selectTxtStyle(colorBack, {bold: true})}`} ref={currScoreRef}>
                ...
            </p>
            <span className={`ml-2 ${selectTxtStyle(colorBack, {bold: true})}`}>
                Pontos
            </span>
        </div>
        {/*LAST SCORE*/}
        {currScore === 0 || !currScore || !showPercentage
         ? null
         : (
            <section className="text-normal position-relative animated slideInLeft slow">
                <div className="ellipse2" style={{ left: needAppForPreview && '160px'}}></div>
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
                        {convertDotToComma(lastScore)}
                    </span>
                </div>
            </section>
        )}
    </div>
);

export default AllScores;
