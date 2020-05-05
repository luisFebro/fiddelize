import React, { useRef, useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import getDayGreetingBr from '../../../utils/getDayGreetingBr';
import animateNumber, { getAnimationDuration } from '../../../utils/numbers/animateNumber';
import { useAuthUser } from '../../../hooks/useAuthUser';
import checkIfElemIsVisible from '../../../utils/window/checkIfElemIsVisible';
import lStorage, { confettiPlayOp, needAppRegisterOp } from '../../../utils/storage/lStorage';
import { confetti } from '../../../keyframes/animations-js/confetti/confetti';
import { useStoreDispatch } from 'easy-peasy';
import getFirstName from '../../../utils/string/getFirstName';
import AOS from 'aos';
import "../ellipse.css";
import { setRun } from '../../../hooks/useRunComp';
import RadiusBtn from '../../../components/buttons/RadiusBtn';
import "./style.scss";
import scrollIntoView from '../../../utils/document/scrollIntoView';
import BadaloBell from '../../../components/buttons/bells/badalo/BadaloBell';

// APP COMPONENTS
import RatingIcons from '../RatingIcons';
import ProgressMsg from '../ProgressMsg' ;
import MoreOptionsBtn from '../MoreOptionsBtn';
import AllScores from '../AllScores';
import PercCircleAndGift from '../PercCircleAndGift';
// END APP COMPONENTS

function ClientUserAppContent({
    history,
    useProfile,
    useClientUser,
    useClientAdmin,
    needAppForCliAdmin,
    needAppForPreview,
    runName,
    colorP,
    colorS,
    colorBack,
    rewardScoreTest }) {
    if(!colorP) { colorP = "default" }
    if(!colorS) { colorS = "default" }

    const [showMoreComps, setShowMoreComps] = useState(false);
    const [showMoreBtn, setShowMoreBtn] = useState(false);

    const currScoreRef = useRef(null);

    let { role, name } = useProfile();
    name = needAppForPreview ? name : getFirstName(name);
    const { currScore, lastScore, } = useClientUser();
    let { maxScore, bizCodeName, selfMilestoneIcon } = useClientAdmin();

    if(rewardScoreTest) {
        maxScore = Number(rewardScoreTest);
    }

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
        const condition = isAuthUser && role === "cliente" || needAppForCliAdmin || needAppForPreview;
        if(condition) {
            animateNumber(
                currScoreRef.current,
                0,
                currScore,
                getAnimationDuration(currScore),
                setShowMoreComps
            );
        }
    }, [role, isAuthUser, needAppForCliAdmin])

    checkIfElemIsVisible("#rules", setShowMoreBtn);

    useEffect(() => {
        const playConfettiAgain = lStorage("getItem", confettiPlayOp)
        if(!playConfettiAgain && currScore >= maxScore) {
            confetti.start();
            lStorage("setItem", confettiPlayOp);
        } else {
            if(confetti.isRunning && showMoreComps) {
                setTimeout(() => confetti.stop(), 5000)
            }
        }

        if(playConfettiAgain && currScore <= maxScore) {
            lStorage("removeItem", confettiPlayOp); // returns null if no keys were found.
        }


    }, [maxScore, currScore, showMoreComps]);

    // UTILS
    function playBeep() {
        const elem = document.querySelector("#appBtn");
        elem.play();
    }
    // END UTILS

    const showGreetingAndNotific = () => (
        <section className="mt-3 position-relative animated slideInLeft slow">
            <section className="position-relative">
                <div className="ellipse" style={{backgroundColor: "var(--themePLight--" + colorP + ")"}}></div>
                <div className={`${needAppForPreview && "enabledLink"}`}>
                    <BadaloBell
                        position="absolute"
                        top={5}
                        left={270}
                        notifBorderColor={"var(--themePDark--" + colorP + ")"}
                        notifBackColor={colorP === "red" ? "var(--themePLight--black)" : "var(--expenseRed)"}
                        badgeValue={2}
                    />
                </div>
            </section>
            <div
                style={{position: 'absolute', top: '1px', lineHeight: '.9em'}}
                className="ml-3 mb-2 text-white text-shadow text-subtitle text-left">
                {getDayGreetingBr()},
                <br/>
                <span className="text-title">
                    {`${name}!`}
                </span>
            </div>
        </section>
    );

    const showAllScores = () => (
        <AllScores
            currScoreRef={currScoreRef}
            currScore={currScore}
            showPercentage={showMoreComps}
            lastScore={lastScore}
            needAppForPreview={needAppForPreview}
        />
    );

    const showPercCircleAndGift = () => (
        <PercCircleAndGift
            currScore={currScore}
            classNamePerc={`${needAppForPreview && "enabledLink"}`}
            maxScore={maxScore}
            showPercentage={showMoreComps}
            playBeep={playBeep}
            colorS={colorS}
            colorP={colorP}
        />
    );

    const showRatingIcons = () => (
        <div
            style={{margin: `40px ${needAppForPreview ? '-10px' : '0'} 80px`}}
            className={`${needAppForPreview && "enabledLink"}`}
        >
            <RatingIcons
                score={currScore}
                maxScore={maxScore || 0}
                selfMilestoneIcon={selfMilestoneIcon}
                runName={runName}
            />
            {showMoreComps
            ? (
                <div>
                    <ProgressMsg
                        currScore={currScore || 0}
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
                    className="container-center position-relative"
                    style={{ top: `${needAppForPreview && "15px"}` }}
                >
                    <Link to={needAppForCliAdmin ? "/regulamento?client-admin=1" : "/regulamento"}>
                        <div
                            className="no-text-decoration text-shadow text-normal text-center pressed-to-left"
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
            userName={name}
            needAppForCliAdmin={needAppForCliAdmin}
            needAppForPreview={needAppForPreview}
            colorS={colorS}
        />
    );

    const backBtnForCliAdmin = () => (
        needAppForCliAdmin &&
        <section className="back-btn-client-admin">
            <div className="container">
                <p className="title">
                    Modo App Cliente
                </p>
                <div className="btn">
                    <RadiusBtn
                        size="extra-small"
                        title="voltar painel"
                        onClick={() => {
                            setRun(dispatch, "goDash");
                            history.push(`/${bizCodeName}/cliente-admin/painel-de-controle`);
                        }}
                    />
                </div>
            </div>
        </section>
    );

    return (
        <div className={`${needAppForPreview && "disabledLink"}`}>
            {showGreetingAndNotific()}
            {showAllScores()}
            {showPercCircleAndGift()}
            {showRatingIcons()}
            {showRules()}
            {showMoreOptionsBtn()}
            {backBtnForCliAdmin()}
            <audio id="appBtn" src="/sounds/app-btn-sound.wav"></audio>
        </div>
    );
}

export default withRouter(ClientUserAppContent);

/*

 */