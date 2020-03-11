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
import "./ellipse.css";
import LoadingThreeDots from '../../components/loadingIndicators/LoadingThreeDots';
import { confetti } from '../../keyframes/animations-js/confetti/confetti';
import getDayGreetingBr from '../../utils/getDayGreetingBr';
import checkIfElemIsVisible from '../../utils/window/checkIfElemIsVisible';
import lStorage from '../../utils/storage/lStorage';
import { confettiPlay, userProfileOp, needInitialStateOp, needAppRegisterOp } from './lStorageStore';
import setDataIfOnline from '../../utils/storage/setDataIfOnline';
import Register from '../../components/auth/Register';

// import ImageLogo from '../../components/ImageLogo';

// This following logic will inserted in the client-user's download button.
// lStorage("setItem", needAppRegisterOp);
//

const needAppRegister = lStorage("getItem", needAppRegisterOp);
// const options1 = {...needAppRegisterOp, value: }

const isSmall = window.Helper.isSmallScreen();

function ClientMobileApp({ history }) {
    // history and withRouter is not being used
    const userScoreRef = useRef(null);

    const [showMoreBtn, setShowMoreBtn] = useState(false);
    const [showMoreComps, setShowMoreComps] = useState(false);
    const [loginOrRegister, setLoginOrRegister] = useState("login");

    let { role, loyaltyScores, userName, clientAdmin } = useStoreState(state => ({
        role: state.userReducer.cases.currentUser.role,
        userName: state.userReducer.cases.currentUser.name,
        loyaltyScores: state.userReducer.cases.currentUser.loyaltyScores,
        clientAdmin: state.userReducer.cases.currentUser.clientAdminData,
    }))

    let maxScore = 500; // clientAdmin.reward.score > need to create this path in the userData.
    let userScore = loyaltyScores && loyaltyScores.currentScore;
    let userLastScore = loyaltyScores && loyaltyScores.cashCurrentScore;

    setDataIfOnline(userProfileOp, role, userName, maxScore, userScore, userLastScore);

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


    const options = confettiPlay;

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
        if(gotToken && role === "cliente") {
            animateNumber(
                userScoreRef.current,
                0,
                userScore,
                getAnimationDuration(userScore),
                setShowMoreComps
            );
        }
    }, [role, gotToken])

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
            userName={userName}
        />
    );

    const showLogin = () => (
        <div className="container-center" style={{margin: '120px 0 0'}}>
            <Login isClientUser={role === "cliente" ? true : false} setLoginOrRegister={setLoginOrRegister} />
        </div>
    );

    const showRegister = (needLoginBtn, needSetFunc) => (
        <Register
            isClientUser={true}
            setLoginOrRegister={setLoginOrRegister || true}
            needLoginBtn={needLoginBtn}
        />
    );

    const conditionRegister = !gotToken && loginOrRegister === "register" && showRegister(true)
    const conditionLogin = !gotToken && loginOrRegister === "login" && showLogin()

    return (
        <div style={{overflowX: 'hidden'}}>
            <span className="text-right text-white for-version-test">{"test1"}</span>
            {showLogo()}
            <section>
                {needAppRegister
                ? (
                    <Fragment>
                        {showRegister(false)}
                        {lStorage("setItem", {...needAppRegisterOp, value: false})}
                    </Fragment>
                ) : (
                    <Fragment>
                        {conditionRegister}
                        {conditionLogin}
                    </Fragment>
                )}
            </section>

            {gotToken && (
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
{gotToken && !userName
? (
    <div style={{margin: '200px 0 0'}}>
        <LoadingThreeDots color="white" />
    </div>
)
 */

/*
<div className="my-3 container-center">
    <img src="/img/official-logo.jpg" alt="logo" width={300} height="auto"/>
</div>
 */