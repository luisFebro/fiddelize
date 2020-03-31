import React, { useEffect, Fragment } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './CartRace.scss';
import PropTypes from 'prop-types';
import lStorage from '../../../../../../../utils/storage/lStorage';
import animateCartByScore, { options } from './animateCartByScore';

const clientAdmin = lStorage("getItems", { collection: "clientAdmin"});
const rewardScore = clientAdmin && clientAdmin.maxScore;
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

    useEffect(() => {
        const currChallenge = challengeN;
        animateCartByScore(currUserScore, rewardScore, { ...options, currChallenge, userName});
    }, [rewardScore, currUserScore])

    const showLineRoad = () => (
        <div className="line">
            <p id="dot1" className=""></p>
            <p id="dot2" className=""></p>
            <p id="dot3" className=""></p>
            <p id="dot4" className=""></p>
            <p id="dot5" className=""></p>
            <div className="vertical-line">
                <p className=""></p>
            </div>
        </div>
    );

    return (
        <div className={className} id={id}>
            <p
                className="mot-challenge-msg text-subtitle text-purple text-center"
            >
                {isEvenSmall && challengeN && `Desafio #${challengeN}`}
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