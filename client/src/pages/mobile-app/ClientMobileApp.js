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
import animateNumber from '../../utils/numbers/animateNumber';
import getDayGreetingBr from '../../utils/getDayGreetingBr';
import checkIfElemIsVisible from '../../utils/window/checkIfElemIsVisible';
import showVanillaToast from '../../components/vanilla-js/toastify/showVanillaToast';
import "./ellipse.css";
import "../../keyframes/shake.css";
// import LoadingThreeDots from '../../components/loadingIndicators/LoadingThreeDots';
// import ImageLogo from '../../components/ImageLogo';

const isSmall = window.Helper.isSmallScreen();

function ClientMobileApp({ history }) {
    // history and withRouter is not being used
    const userScoreRef = useRef(null);

    const [showMoreBtn, setShowMoreBtn] = useState(false);
    const [showPercentage, setShowPercentage] = useState(false);

    let { isUserAuth, role, loyaltyScores, userName } = useStoreState(state => ({
        isUserAuth: state.authReducer.cases.isUserAuthenticated,
        role: state.userReducer.cases.currentUser.role,
        userName: state.userReducer.cases.currentUser.name,
        loyaltyScores: state.userReducer.cases.currentUser.loyaltyScores,
    }))

    checkIfElemIsVisible("#rules", setShowMoreBtn)

    // const dispatch = useStoreDispatch();

    const maxScore = 300; //loyaltyScores && loyaltyScores.maxScore;
    const userScore = loyaltyScores && loyaltyScores.currentScore;
    const userLastScore = loyaltyScores && loyaltyScores.cashCurrentScore;

    useEffect(() => {
        if(isUserAuth && role === "cliente") {
            animateNumber(
                userScoreRef.current,
                0,
                userScore,
                3000,
                setShowPercentage
            );
        }
    }, [role, isUserAuth])

    // UTILS
    function playBeep() {
        // Not working
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
                {getDayGreetingBr()},<br/> <span className="text-title">{userName.cap() + "!"}</span>
            </div>
        </section>
    );

    const showAllScores = () => (
        <AllScores
            userScoreRef={userScoreRef}
            userScore={userScore}
            showPercentage={showPercentage}
            userLastScore={userLastScore}
        />
    );

    const showPercCircleAndGift = () => (
        <PercCircleAndGift
            userScore={userScore}
            maxScore={maxScore}
            showPercentage={showPercentage}
        />
    );

    const showRatingIcons = () => (
        <div style={{margin: '40px 0 50px'}}>
            <RatingIcons score={userScore} />
            {showPercentage
            ? (
                <div>
                    <ProgressMsg userScore={userScore || 0} maxScore={maxScore || 0} />
                </div>
            ) :  null}
        </div>
    );

    const showRules = () => (
        <Link to="/regulamento">
            <div
                onClick={playBeep}
                id="rules"
                className="text-normal font-weight-italic text-center"
                style={{color: "var(--mainWhite)", cursor: "pointer"}}
            >
                Consulte<br />Regras Aqui
            </div>
        </Link>
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
            <section>
                {isUserAuth && role === "cliente"
                ? (
                    <Fragment>
                        {showGreeting()}
                        {showAllScores()}
                        {showPercCircleAndGift()}
                        {showRatingIcons()}
                        <div className="mb-4">
                            {showRules()}
                        </div>
                        {showMoreOptionsBtn()}
                        <audio id="appBtn" src="https://ia601500.us.archive.org/29/items/confirmation-keypad-sound/confirmation-keypad-sound.wav"></audio>
                    </Fragment>
                ) : (
                    <div style={{margin: '120px 0 0'}}>
                        {showLogin()}
                    </div>
                )}
            </section>
        </div>
    );
}

export default withRouter(ClientMobileApp);

/* ARCHIVES
{loading
? (
    <LoadingThreeDots color="white" />
) : (

)}
 */

/*
<div className="my-3 container-center">
    <img src="/img/official-logo.jpg" alt="logo" width={300} height="auto"/>
</div>
 */