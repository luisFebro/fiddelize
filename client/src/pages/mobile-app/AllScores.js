import React from 'react';
import { convertDotToComma } from '../../utils/numbers/convertDotComma';

const AllScores = ({ userScoreRef, userScore, showPercentage, userLastScore }) => (
    <div className="text-subtitle my-3 text-white text-center">
        <span className="text-title">Fidelidômetro:</span><br/>
        <div className="d-flex justify-content-center">
            <p className="text-title" ref={userScoreRef}>...</p>
            <span className="ml-2">Pontos</span>
        </div>
        {/*LAST SCORE*/}
        {userScore === 0 || !userScore || !showPercentage
         ? null
         : (
            <section className="text-normal position-relative animated slideInLeft slow">
                <div className="ellipse2"></div>
                <div
                    style={{
                        zIndex: 10,
                        lineHeight: '1.2em',
                        color: 'var(--themeP)',
                        position: 'absolute',
                        top: '-18px',
                        left: '200px'}}
                    className="text-em-0-7 text-nowrap font-weight-bold"
                >
                    Sua<br />última pontuação:<br />
                    <span className="text-em-1-3">
                        {convertDotToComma(userLastScore)}
                    </span>
                </div>
            </section>
        )}
    </div>
);

export default AllScores;
