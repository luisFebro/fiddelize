// 75% of screen and 360 x 588 is the nearest screen size resolution of a common mobile
import React, { Fragment, useRef, useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Tilt from 'react-tilt'
import RatingIcons from './RatingIcons';
import ProgressMsg from './ProgressMsg';
import { useStoreState, useStoreDispatch } from 'easy-peasy';
import { logout } from '../../redux/actions/authActions';
import { showComponent } from '../../redux/actions/componentActions';
import ImageLogo from '../../components/ImageLogo';
import Login from '../../components/auth/Login';
import {CLIENT_URL} from '../../config/clientUrl';
// import LoadingThreeDots from '../../components/loadingIndicators/LoadingThreeDots';
import { convertDotToComma } from '../../utils/numbers/convertDotComma';
import animateNumber from '../../utils/numbers/animateNumber';
import getPercentage from '../../utils/numbers/getPercentage';
import ReactjsPercentageCircle from '../../components/progressIndicators/ReactjsPercentageCircle/ReactjsPercentageCircle';
import getDayGreetingBr from '../../utils/getDayGreetingBr';
import checkIfElemIsVisible from '../../utils/window/checkIfElemIsVisible';
// SpeedDial and Icons
import SpeedDialButton from '../../components/buttons/SpeedDialButton';
import showVanillaToast from '../../components/vanilla-js/toastify/showVanillaToast';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
// End SpeedDial and Incons
import "./ellipse.css";

const isSmall = window.Helper.isSmallScreen();

function ClientMobileApp({ history }) {
    const userScoreRef = useRef(null);

    const [showMoreBtn, setShowMoreBtn] = useState(false);
    const [showPercentage, setShowPercentage] = useState(false);

    let { isUserAuth, role, loyaltyScores, userName } = useStoreState(state => ({
        isUserAuth: state.authReducer.cases.isUserAuthenticated,
        role: state.userReducer.cases.currentUser.role,
        userName: state.userReducer.cases.currentUser.name,
        loyaltyScores: state.userReducer.cases.currentUser.loyaltyScores,
    }))

    const styles = {
        percentageCircle: {
            fontFamily: 'var(--mainFont)',
            fontSize: 'text-em-1-2',
            color: 'var(--themeSDark)'
        }
    }

    const maxScore = 500;

    checkIfElemIsVisible("#rules", setShowMoreBtn)

    const dispatch = useStoreDispatch();

    const userScore = 805; // loyaltyScores && loyaltyScores.currentScore;
    const userLastScore = "50";//loyaltyScores && loyaltyScores.cashCurrentScore;

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

    const showScores = () => {

        const displayAllScores = () => (
            <div className="text-subtitle">
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

        const displayGift = () => (
            <Fragment>
                {userScore >= maxScore
                ? (
                    <div>
                        <p className="text-title">Parabéns!<br />Você ganhou um prêmio.</p>
                        <img
                            className="animated bounce"
                            style={{animationIterationCount: 20}}
                            src="/img/icons/pink-gift-box.png"
                            alt="presente"
                            width={100}
                            height="auto"
                        />
                    </div>
                ) : (
                    <div>
                        <div className="position-relative mt-4">
                            <img style={{opacity: '.5'}} className="animated bounce" src="/img/icons/pink-gift-box.png" alt="presente" width={100} height="auto"/>
                            <p
                                className="text-em-2"
                                style={{position: 'absolute', top: '-10px', left: '45%'}}
                            >
                                ?
                            </p>
                        </div>
                    </div>
                )}
            </Fragment>
        );

        const displayPercentageCircleAndGift = () => (
            <Fragment>
                {showPercentage
                ? (
                    <Fragment>
                        <Tilt
                            className="Tilt"
                            options={{ max : 90, reverse: true }}
                        >
                            <div className="container-center animated zoomIn">
                                <ReactjsPercentageCircle
                                    percent={getPercentage(maxScore, userScore)}
                                    radius={70} /*circle size*/
                                    borderWidth={16}
                                    color="var(--themeS)" /*external line color*/
                                    textStyle={styles.percentageCircle}
                                />
                            </div>
                        </Tilt>
                        {displayGift()}
                    </Fragment>
                ) : null}
            </Fragment>
        );

        return(
            <div className="my-3 text-white text-em-2-5 text-center text-default">
                {displayAllScores()}
                {displayPercentageCircleAndGift()}
            </div>
        );

    };

    const showRatingIcons = () => (
        <div style={{margin: '40px 0 90px'}}>
            <RatingIcons score={userScore} />
            <div>
                <ProgressMsg userScore={userScore} maxScore={maxScore} />
            </div>
        </div>
    );

    const showRules = () => (
        <Link to="/regulamento">
            <div
                onClick={null} //playBeep
                id="rules"
                className="text-normal font-weight-italic text-center"
                style={{color: "var(--mainWhite)", cursor: "pointer"}}
            >
                Consulte<br />Regras Aqui
            </div>
        </Link>
    );

    const showMoreOptionsBtn = () => {
        const speedDial = {
            actions: [
                //the order rendered is inverse from the bottom to top
                {
                    icon: <ExitToAppIcon />,
                    name: 'Desconectar',
                    backColor: 'var(--themeSDark)',
                    onClick: () => {
                        logout(dispatch);
                        playBeep();
                    }
                },
                {
                    icon: <LoyaltyIcon />,
                    name: 'Adicionar Pontos',
                    backColor: 'var(--themeSDark)',
                    onClick: () => {
                        showComponent(dispatch, "purchaseValue");
                        history.push("/cliente/pontos-fidelidade");
                        playBeep();
                    },
                },
            ]
        }

        function playBeep() {
            // Not working
            const elem = document.querySelector("#appBtn");
            elem.play();
        }

        return(
            <SpeedDialButton
                actions={speedDial.actions}
                tooltipOpen={true}
                size="large"
                FabProps={{
                    backgroundColor: 'var(--themeSDark)',
                    size: 'medium',
                    boxShadow: '.5px .5px 3px black', // not working
                }}
                root={{
                    bottom: '30px',
                    right: '40px',
                }}
                hidden={!showMoreBtn}
            />
        );
    }

    return (
        <div>
            {showLogo()}
            <section>
                {isUserAuth && role === "cliente"
                ? (
                    <Fragment>
                        {showGreeting()}
                        {showScores()}
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

/*
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