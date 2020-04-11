import React, { Fragment, useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import getDayGreetingBr from '../../../utils/getDayGreetingBr';
import animateNumber, { getAnimationDuration } from '../../../utils/numbers/animateNumber';
import { useAuthUser } from '../../../hooks/useAuthUser';
import checkIfElemIsVisible from '../../../utils/window/checkIfElemIsVisible';
import lStorage, { confettiPlayOp, needAppRegisterOp } from '../../../utils/storage/lStorage';
import { confetti } from '../../../keyframes/animations-js/confetti/confetti';
import { useStoreDispatch } from 'easy-peasy';
import AOS from 'aos';
import "../ellipse.css";
// APP COMPONENTS
import RatingIcons from '../RatingIcons';
import ProgressMsg from '../ProgressMsg' ;
import MoreOptionsBtn from '../MoreOptionsBtn';
import AllScores from '../AllScores';
import PercCircleAndGift from '../PercCircleAndGift';
// END APP COMPONENTS

export default function ClientUserAppContent({ useProfile, useClientUser, useClientAdmin }) {
    const [showMoreComps, setShowMoreComps] = useState(false);
    const [showMoreBtn, setShowMoreBtn] = useState(false);

    const userScoreRef = useRef(null);

    const { role, userName } = useProfile();
    const { userScore, userLastScore, } = useClientUser();
    console.log("userScore", userScore);
    const { maxScore } = useClientAdmin();

    const { isAuthUser } = useAuthUser();

    const dispatch = useStoreDispatch();

    AOS.init({
        offset: 50,
    });

    const styles = {
        rulesBtn: {
            width: '130px',
            color: "var(--mainWhite)",
            cursor: "pointer",
        }
    }

    useEffect(() => {
        if(isAuthUser && role === "cliente") {
            animateNumber(
                userScoreRef.current,
                0,
                userScore,
                getAnimationDuration(userScore),
                setShowMoreComps
            );
        }
    }, [role, isAuthUser])

    checkIfElemIsVisible("#rules", setShowMoreBtn);

    useEffect(() => {
        const playConfettiAgain = lStorage("getItem", confettiPlayOp)
        if(!playConfettiAgain && userScore >= maxScore) {
            confetti.start();
            lStorage("setItem", confettiPlayOp);
        } else {
            if(confetti.isRunning && showMoreComps) {
                setTimeout(() => confetti.stop(), 5000)
            }
        }

        if(playConfettiAgain && userScore <= maxScore) {
            lStorage("removeItem", confettiPlayOp); // returns null if no keys were found.
        }

    }, [maxScore, userScore, showMoreComps]);

    // UTILS
    function playBeep() {
        const elem = document.querySelector("#appBtn");
        elem.play();
    }
    // END UTILS

    const showGreeting = () => (
        <section className="mt-3 position-relative animated slideInLeft slow">
            <div className="ellipse" style={{backgroundColor: 'var(--themePLight)'}}></div>
            <div
                style={{position: 'absolute', top: '1px', lineHeight: '.9em'}}
                className="ml-3 mb-2 text-white text-shadow text-subtitle text-left">
                {getDayGreetingBr()},<br/> <span className="text-title">{userName + "!"}</span>
            </div>
        </section>
    );

    const showAllScores = () => (
        <AllScores
            userScoreRef={userScoreRef}
            userScore={userScore}
            showPercentage={showMoreComps}
            userLastScore={userLastScore}
        />
    );

    const showPercCircleAndGift = () => (
        <PercCircleAndGift
            userScore={userScore}
            maxScore={maxScore}
            showPercentage={showMoreComps}
            playBeep={playBeep}
        />
    );

    const showRatingIcons = () => (
        <div style={{margin: '40px 0 80px'}}>
            <RatingIcons score={userScore} maxScore={maxScore || 0} />
            {showMoreComps
            ? (
                <div>
                    <ProgressMsg
                        userScore={userScore || 0}
                        maxScore={maxScore || 0}
                        playBeep={playBeep}
                    />
                </div>
            ) :  null}
        </div>
    );

    const showRules = () => (
        <div className="mb-4">
            {showMoreComps
            ? (
                <div
                    id="rules"
                    className="container-center"
                >
                    <Link to="/regulamento">
                        <div
                            className="no-text-decoration text-normal text-center pressed-to-left"
                            onClick={playBeep}
                            style={styles.rulesBtn}>
                            Consulte<br />Regras Aqui
                        </div>
                    </Link>
                </div>
            ) : null}
        </div>
    );

    const showMoreOptionsBtn = () => (
        <MoreOptionsBtn
            playBeep={playBeep}
            showMoreBtn={showMoreBtn}
            userName={userName}
        />
    );

    return (
        <Fragment>
            {showGreeting()}
            {showAllScores()}
            {showPercCircleAndGift()}
            {showRatingIcons()}
            {showRules()}
            {showMoreOptionsBtn()}
            <audio id="appBtn" src="/sounds/app-btn-sound.wav"></audio>
        </Fragment>
    );
}