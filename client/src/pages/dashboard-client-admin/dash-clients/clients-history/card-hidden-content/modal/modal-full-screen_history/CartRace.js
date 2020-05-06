import React, { useEffect, Fragment } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './CartRace.scss';
import PropTypes from 'prop-types';
import animateCartByScore, { options } from './animateCartByScore';
import { useClientAdmin } from '../../../../../../../hooks/useRoleData';

const isEvenSmall = window.Helper.isSmallScreen(415);

CartRace.propTypes = {
    currUserScore: PropTypes.number,
}

const faStyle = {
    fontSize: '35px',
    filter:  'drop-shadow(.5px .5px 1.5px black)',
    color: 'white',
}


export default function CartRace({ currUserScore, challengeN, userName, className, id }) {
    const { maxScore, selfThemeBackColor } = useClientAdmin();
    const currChallenge = challengeN === 1 ? 1 : challengeN - 1;

    const backColor = {backgroundColor: 'var(--themeBackground--' + selfThemeBackColor + ')'};

    useEffect(() => {
        animateCartByScore(currUserScore, maxScore, { ...options, currChallenge, userName});
    }, [maxScore, currUserScore, currChallenge])

    const showLineRoad = () => (
        <div className="line" style={backColor}>
            <p id="dot1" className=""></p>
            <p id="dot2" className=""></p>
            <p id="dot3" className=""></p>
            <p id="dot4" className=""></p>
            <p id="dot5" className=""></p>
            <div className="vertical-line" style={backColor}>
                <p className="" style={backColor}></p>
            </div>
        </div>
    );

    return (
        <div className={className} id={id}>
            <p
                className="mot-challenge-msg text-subtitle text-purple text-center"
            >
                {isEvenSmall && currChallenge && `Desafio n.º ${currChallenge}`}
            </p>
            <p
                id="challenge-msg"
                className="mot-challenge-msg text-small text-center text-purple"
            ></p>
            <div className="cart-race--root mt-3">
                {showLineRoad()}
                <div id="cart" className="cart animated bounce anima-iteration-2">
                    <FontAwesomeIcon icon="shopping-cart" style={faStyle} />
                </div>
                <div id="win-flag" className="flag">
                    <FontAwesomeIcon icon="flag-checkered" style={{...faStyle, fontSize: '45px'}} />
                </div>
            </div>
        </div>
    );
}