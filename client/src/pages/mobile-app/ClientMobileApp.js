// 75% of screen and 360 x 588 is the nearest screen size resolution of a common mobile
import React, { Fragment, useRef, useEffect, useState } from 'react';
import Login from '../../components/auth/Login';
import { Link, withRouter } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';
// APP COMPONENTS
import RatingIcons from './RatingIcons';
import ProgressMsg from './ProgressMsg';
import MoreOptionsBtn from './MoreOptionsBtn';
import AllScores from './AllScores';
import PercCircleAndGift from './PercCircleAndGift';
// END APP COMPONENTS
// UTILS
import {CLIENT_URL} from '../../config/clientUrl';
import animateNumber, { getAnimationDuration } from '../../utils/numbers/animateNumber';
import showVanillaToast from '../../components/vanilla-js/toastify/showVanillaToast';
import "./ellipse.css";
import "../../keyframes/shake.css";
import LoadingThreeDots from '../../components/loadingIndicators/LoadingThreeDots';
import { confetti } from '../../keyframes/animations-js/confetti/confetti';
import getDayGreetingBr from '../../utils/getDayGreetingBr';
import checkIfElemIsVisible from '../../utils/window/checkIfElemIsVisible';
import lStorage from '../../utils/storage/lStorage';
// import ImageLogo from '../../components/ImageLogo';

const isSmall = window.Helper.isSmallScreen();

function ClientMobileApp({ history }) {
    // history and withRouter is not being used
    const userScoreRef = useRef(null);

    const [showMoreBtn, setShowMoreBtn] = useState(false);
    const [showMoreComps, setShowMoreComps] = useState(false);

    let { isUserAuth, role, loyaltyScores, userName } = useStoreState(state => ({
        isUserAuth: state.authReducer.cases.isUserAuthenticated,
        role: state.userReducer.cases.currentUser.role,
        userName: state.userReducer.cases.currentUser.name,
        loyaltyScores: state.userReducer.cases.currentUser.loyaltyScores,
    }))

    const gotToken = localStorage.getItem("token");

    const styles = {
        rulesBtn: {
            width: '130px',
            color: "var(--mainWhite)",
            cursor: "pointer",
        }
    }

    checkIfElemIsVisible("#rules", setShowMoreBtn)

    // const dispatch = useStoreDispatch();

    const maxScore = 630; //loyaltyScores && loyaltyScores.maxScore;
    const userScore = loyaltyScores && loyaltyScores.currentScore;
    const userLastScore = loyaltyScores && loyaltyScores.cashCurrentScore;

    const options = {
        collection: "onceChecked",
        property: "confettiPlay",
        value: true,
    }

    useEffect(() => {
        const playConfettiAgain = lStorage("getItem", options)
        if(!playConfettiAgain && userScore >= maxScore) {
            confetti.start();
            lStorage("setItem", options);
        } else {
            if(confetti.isRunning && showMoreComps) {
                setTimeout(() => confetti.stop(), 5000)
            }
        }

        if(playConfettiAgain && userScore <= maxScore) {
            lStorage("removeOneItem", options); // returns null if no keys were found.
        }

    }, [maxScore, userScore, showMoreComps]);

    useEffect(() => {
        if(isUserAuth && role === "cliente") {
            animateNumber(
                userScoreRef.current,
                0,
                userScore,
                getAnimationDuration(userScore),
                setShowMoreComps
            );
        }
    }, [role, isUserAuth])

    // UTILS
    function playBeep() {
        const elem = document.querySelector("#appBtn");
        elem.play();
    }
    // END UTILS

    const showLogo = () => (
        <div className="container-center">
            <img
                className="animated zoomIn slow"
                style={{position: 'relative', margin: '15px 0', left: isSmall ? '5px' : '20px'}}
                src={CLIENT_URL + "/img/official-logo-name.png"}
                alt="Logomarca Principal"
                width={190}
                height="auto"
            />
        </div>
    );

    const showLogin = () => (
        <div>
            <div className="container-center">
                <Login />
            </div>
        </div>
    );

    const showGreeting = () => (
        <section className="mt-3 position-relative animated slideInLeft slow">
            <div className="ellipse" style={{backgroundColor: 'var(--themePLight)'}}></div>
            <div
                style={{position: 'absolute', top: '1px', lineHeight: '.9em'}}
                className="ml-3 mb-2 text-white text-shadow text-subtitle text-left">
                {getDayGreetingBr()},<br/> <span className="text-title">{userName && userName.cap() + "!"}</span>
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
        <div style={{margin: '40px 0 50px'}}>
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
        <div>
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
        />
    );

    return (
        <div style={{overflowX: 'hidden'}}>
            {showLogo()}
            {!gotToken && (
                <div style={{margin: '120px 0 0'}}>
                    {showLogin()}
                </div>
            )}

            {gotToken && !userName
            ? (
                <div style={{margin: '200px 0 0'}}>
                    <LoadingThreeDots color="white" />
                </div>
            ) : (
                <section>
                    {role === "cliente" && (
                        <Fragment>
                            {showGreeting()}
                            {showAllScores()}
                            {showPercCircleAndGift()}
                            {showRatingIcons()}
                            <div className="mb-4">
                                {showRules()}
                            </div>
                            {showMoreOptionsBtn()}
                            <audio id="appBtn" src="/sounds/app-btn-sound.wav"></audio>
                        </Fragment>
                    )}
                </section>
            )}
        </div>
    );
}

export default withRouter(ClientMobileApp);

/* ARCHIVES
 */

/*
<div className="my-3 container-center">
    <img src="/img/official-logo.jpg" alt="logo" width={300} height="auto"/>
</div>
 */