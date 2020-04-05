// 75% of screen and 360 x 588 is the nearest screen size resolution of a common mobile
import React, { Fragment, useRef, useEffect, useState } from 'react';
import Login from '../../components/auth/Login';
import { Link, withRouter } from 'react-router-dom';
import { useStoreDispatch } from 'easy-peasy';
import { useProfile, useClientAdmin, useClientUser } from '../../hooks/useRoleData';
// APP COMPONENTS
import RatingIcons from './RatingIcons';
import ProgressMsg from './ProgressMsg' ;
import MoreOptionsBtn from './MoreOptionsBtn';
import AllScores from './AllScores';
import PercCircleAndGift from './PercCircleAndGift';
import RadiusBtn from '../../components/buttons/RadiusBtn';
// END APP COMPONENTS
import {CLIENT_URL} from '../../config/clientUrl';
import animateNumber, { getAnimationDuration } from '../../utils/numbers/animateNumber';
import "./ellipse.css";
import LoadingThreeDots from '../../components/loadingIndicators/LoadingThreeDots';
import { confetti } from '../../keyframes/animations-js/confetti/confetti';
import getDayGreetingBr from '../../utils/getDayGreetingBr';
import checkIfElemIsVisible from '../../utils/window/checkIfElemIsVisible';
import lStorage, {
    confettiPlayOp,
    userProfileOp,
    clientAdminOp, needAppRegisterOp } from '../../utils/storage/lStorage';
import Register from '../../components/auth/Register';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { logout } from '../../redux/actions/authActions';
import { setRun } from '../../hooks/useRunComp';
import { useAuthUser } from '../../hooks/useAuthUser';
import AOS from 'aos';
// import ImageLogo from '../../components/ImageLogo';

const needAppRegister = lStorage("getItem", needAppRegisterOp);

//AppSystem
const appSystemCollection = { collection: "appSystem"};
const appSystem = lStorage("getItems", appSystemCollection);

const isSmall = window.Helper.isSmallScreen();

function ClientMobileApp({ history }) {
    // history and withRouter is not being used
    const userScoreRef = useRef(null);
    const { isAuthUser } =useAuthUser();

    const [showMoreBtn, setShowMoreBtn] = useState(false);
    const [showMoreComps, setShowMoreComps] = useState(false);
    const [loginOrRegister, setLoginOrRegister] = useState("login");

    const { userId, role, userName } = useProfile();
    const { bizId, userScore, userLastScore, userPurchase } = useClientUser();
    const { bizCodeName, maxScore } = useClientAdmin();
    // setDataIfOnline(userProfileOp, { userName, userScore, userLastScore, userPurchase });

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

    checkIfElemIsVisible("#rules", setShowMoreBtn)

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

    useEffect(() => {
        if(needAppRegister) {
            setLoginOrRegister("register");
            lStorage("setItem", {...needAppRegisterOp, value: false})
        }
    }, [needAppRegister])

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
        <div className="container-center">
            <Login isClientUser={role === "cliente" ? true : false} setLoginOrRegister={setLoginOrRegister} />
        </div>
    );

    const showRegister = (needLoginBtn, needSetFunc) => (
        <Register
            setLoginOrRegister={setLoginOrRegister || true}
            needLoginBtn={needLoginBtn}
        />
    );

    const isClientUserLogged = isAuthUser && role === "cliente";
    const showAppType = () => (
        appSystem && !isClientUserLogged &&
        <div className="container-center" data-aos="flip-right" data-aos-delay="3000">
            <div className="position-relative">
                <p style={{zIndex: 2000, top: '20px', left: '150px'}} className="text-center text-white position-absolute text-shadow">
                    <span className="text-subtitle font-weight-bold">App</span>
                    <br />
                    <span
                        className="text-title text-nowrap"
                    >
                        do {
                            appSystem && appSystem.roleWhichDownloaded === "cliente"
                            ? "Cliente" : "Admin"
                        }
                    </span>
                </p>
                <div style={{animationIterationCount: 3}} className="animated rubberBand delay-5s">
                    <img width={460} height={130} src={`${CLIENT_URL}/img/shapes/blob1.svg`} alt="tipo de app"/>
                </div>
            </div>
        </div>
    );

    const showConnectedStatus = () => (
        <div className="mt-5 container-center-col text-white text-normal text-center">
            <span>
                Conectado por
                <br/>
                <strong className="text-title">{userName && userName.cap()}</strong><br />
            </span>
            <div className="container-center mt-4">
                <Link
                    className="mr-3"
                    to={`/${bizCodeName}/cliente-admin/painel-de-controle`}
                    onClick={() => setRun(dispatch, "goDash")}
                >
                    <RadiusBtn title="acessar"/>
                </Link>
                <span>
                    <RadiusBtn
                        title="sair"
                        backgroundColor="var(--mainRed)"
                        onClick={() => logout(dispatch)}
                    />
                </span>
            </div>
        </div>
    );

    const conditionRegister = !isAuthUser && loginOrRegister === "register" && showRegister(true)
    const conditionLogin = !isAuthUser && loginOrRegister === "login" && showLogin()

    return (
        <div style={{overflowX: 'hidden'}}>
            <span className="text-right text-white for-version-test">{""}</span>
            {showLogo()}
            {showAppType()}
            <section>
                {conditionRegister}
                {conditionLogin}
            </section>

            {isAuthUser && (
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
                    {role !== "cliente" && appSystem && appSystem.roleWhichDownloaded !== "cliente" && (
                        <Fragment>
                            {showConnectedStatus()}
                            {!isAuthUser && showLogin()}
                        </Fragment>
                    )}
                </section>
            )}
        </div>
    );
}

export default withRouter(ClientMobileApp);

/* ARCHIVES
{isAuthUser && !userName
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