import React, { Fragment, useRef, useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Tilt from 'react-tilt'
import RatingStars from './RatingStars';
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

const maxScore = 500;
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

    checkIfElemIsVisible("#rules", setShowMoreBtn)

    const dispatch = useStoreDispatch();

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

    const playBeep = () => {
        // Not working
        const elem = document.querySelector("#appBtn");
        elem.play();
    }

    const showLogin = () => (
        <div className="my-5">
            <div className="mb-3 text-white text-em-2-5 text-center text-default">
                Faça seu acesso.
            </div>
            <div className="margin-auto-60">
                <Login />
            </div>
        </div>
    );

    const showGreeting = () => (
        <section className="position-relative animated slideInLeft slow">
            <div className="ellipse"></div>
            <div
                style={{position: 'absolute', top: '-5px'}}
                className="ml-2 mb-2 text-white text-shadow text-em-1-4 text-left text-default">
                {getDayGreetingBr()},<br/> <span className="text-em-1-8">{userName.cap() + "!"}</span>
            </div>
        </section>
    );

    const showScores = () => {

        const displayAllScores = () => (
            <Fragment>
                Fidelidômetro:<br/>
                <div className="d-flex justify-content-center">
                    <p ref={userScoreRef}>...</p>
                    <p className="ml-3">Pontos</p>
                </div>
                {/*LAST SCORE*/}
                {userScore === 0 || !userScore || !showPercentage
                 ? null
                 : (
                    <section className="position-relative animated slideInLeft slow">
                        <div className="ellipse2"></div>
                        <div
                            style={{
                                zIndex: 10,
                                color: 'var(--mainPink)',
                                position: 'absolute',
                                top: '-5px',
                                left: '220px'}}
                            className="text-em-0-5 text-nowrap"
                        >
                            Última pontuação:<br />
                            <span className="text-em-1">
                                <strong>{convertDotToComma(userLastScore)}</strong>
                            </span>
                        </div>
                    </section>
                )}
            </Fragment>
        );


        const displayGift = () => (
            <Fragment>
                {userScore >= maxScore
                ? (
                    <div>
                        <p>Parabéns!<br />Você ganhou um prêmio.</p>
                        <img className="animated bounce" style={{animationIterationCount: 20}} src="/img/icons/pink-gift-box.png" alt="presente" width={100} height="auto"/>
                    </div>
                ) : (
                    <div>
                        <div className="position-relative mt-4">
                            <img style={{opacity: '.5'}} className="animated bounce" src="/img/icons/pink-gift-box.png" alt="presente" width={100} height="auto"/>
                            <p className="text-em-2" style={{position: 'absolute', top: '10px', left: '48%'}}>?</p>
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
                                    color="var(--mainPink)"
                                    radius={70}
                                    borderWidth={10}
                                    textStyle="text-pink text-em-1-2"
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

    const showRules = () => (
        <Link to="/regulamento">
            <div
                onClick={playBeep}
                id="rules"
                className="text-container font-weight-italic text-center"
                style={{color: "var(--mainPink)", cursor: "pointer"}}
            >
                Consulte<br />as Regras Aqui
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
                    backColor: 'var(--mainPink)',
                    onClick: () => {
                        logout(dispatch);
                        playBeep();
                    }
                },
                {
                    icon: <LoyaltyIcon />,
                    name: 'Adicionar Pontos',
                    backColor: 'var(--mainPink)',
                    onClick: () => {
                        showComponent(dispatch, "purchaseValue");
                        history.push("/cliente/pontos-fidelidade");
                        playBeep();
                    },
                },
            ]
        }

        return(
            <SpeedDialButton
                actions={speedDial.actions}
                tooltipOpen={true}
                size="large"
                FabProps={{
                    backgroundColor: 'var(--mainPink)',
                    size: 'medium',
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
            <div className="margin-auto-90">
                <img
                    className="animated zoomIn slow"
                    style={{position: 'absolute', top: '10px', left: isSmall ? '5px' : '20px'}}
                    src={CLIENT_URL + "/img/official-logo-name.png"}
                    alt="Logomarca Principal"
                    />
            </div>
            <section>
                {isUserAuth && role === "cliente"
                ? (
                    <Fragment>
                        <br/>
                        <br/>
                        {showGreeting()}
                        {showScores()}
                        <div className="mb-4">
                            <RatingStars score={userScore} />
                        </div>
                        <div className="mb-4">
                            {showRules()}
                        </div>
                        {showMoreOptionsBtn()}
                        <audio id="appBtn" src="https://ia601500.us.archive.org/29/items/confirmation-keypad-sound/confirmation-keypad-sound.wav"></audio>
                    </Fragment>
                ) : showLogin()}
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