import React, { useRef, useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import getDayGreetingBr from '../../../utils/getDayGreetingBr';
import animateNumber, { getAnimationDuration } from '../../../utils/numbers/animateNumber';
import { useAuthUser } from '../../../hooks/useAuthUser';
import lStorage, { confettiPlayOp, needAppRegisterOp } from '../../../utils/storage/lStorage';
import { useStoreDispatch } from 'easy-peasy';
import getFirstName from '../../../utils/string/getFirstName';
import selectTxtStyle from '../../../utils/biz/selectTxtStyle';
import "../ellipse.css";
import { setRun } from '../../../hooks/useRunComp';
import RadiusBtn from '../../../components/buttons/RadiusBtn';
import "./style.scss";
import scrollIntoView from '../../../utils/document/scrollIntoView';
import BadaloBell from '../../../components/buttons/bells/badalo/BadaloBell';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { currTxtColor } from '../../../utils/biz/selectTxtStyle';
import ButtonFab from '../../../components/buttons/material-ui/ButtonFab';
import useElemShowOnScroll from '../../../hooks/scroll/useElemShowOnScroll';
// import usePlayAudio from '../../../hooks/media/usePlayAudio';
import useCount from '../../../hooks/useCount';
import CompLoader from '../../../components/CompLoader';
// import useDelay from '../../../hooks/useDelay';

// APP COMPONENTS
import RatingIcons from '../RatingIcons';
import AsyncProgressMsg from '../AsyncProgressMsg' ;
import AsyncMoreOptionsBtn from '../AsyncMoreOptionsBtn';
import AllScores from '../AllScores';
import AsyncPercCircleAndGift from '../AsyncPercCircleAndGift';
// END APP COMPONENTS

const loadConfetti = async (command) => {
    const { getConfetti } = await import('../../../keyframes/animations-js/confetti/confetti' /* webpackChunkName: "confetti-anima-lazy" */);
    const confetti = getConfetti();

    if(command === "start") return confetti.start();
    if(command === "isRunning") return confetti.isRunning;
    if(command === "stop") return confetti.stop();
}

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

    // usePlayAudio("/sounds/app-btn-sound.wav", '.app-btn--audio') // not working because elem is not displayed on DOM when mounted.
    useCount("ClientUserAppContent.js"); // RT = 4

    const [showMoreComps, setShowMoreComps] = useState(false);

    // const targetElem = useRef(null); // withObserver does not track right away, there is a delay...
    const showMoreBtn = useElemShowOnScroll('.target--rules-page', { tSpan: 20 });
    // multi scroll dection does not work for now...
    // const showPercGiftComp = useElemShowOnScroll("#target---perc-gift");

    const currScoreRef = useRef(null);

    let { role, name } = useProfile();
    name ? name = getFirstName(name) : name = "cliente";

    const { currScore, lastScore, } = useClientUser();
    let { maxScore, bizCodeName, selfMilestoneIcon, selfThemeSColor, selfThemeBackColor } = useClientAdmin();

    if(rewardScoreTest) {
        maxScore = Number(rewardScoreTest);
    }

    const { isAuthUser } = useAuthUser();

    const dispatch = useStoreDispatch();

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


    useEffect(() => {
        const playConfettiAgain = lStorage("getItem", confettiPlayOp)
        if(!playConfettiAgain && currScore >= maxScore) {
            loadConfetti("start");
            lStorage("setItem", confettiPlayOp);
        } else {
            if(loadConfetti("isRunning") && showMoreComps) {
                setTimeout(() => loadConfetti("stop"), 5000)
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

    const handlePreload = () => {
        // if user mouse over the "mostrar mais" btn
        AsyncPercCircleAndGift.preload();
    }
    // END UTILS
    const backColorSelect = colorBack || selfThemeBackColor || colorP;

    const showGreetingAndNotific = () => (
        <section className="mt-3 position-relative animated slideInLeft slow">
            <section className="position-relative">
                <div className="ellipse" style={{backgroundColor: "var(--themePLight--" + colorP + ")", width: needAppForPreview && '21.8em',}}></div>
                <div className={`${needAppForPreview && "enabledLink"}`}>
                    <BadaloBell
                        position="absolute"
                        top={5}
                        left={needAppForPreview ? 258 : 270}
                        notifBorderColor={"var(--themeBackground--" + backColorSelect + ")"}
                        notifBackColor={backColorSelect === "red" ? "var(--themePLight--black)" : "var(--expenseRed)"}
                        badgeValue={1}
                    />
                </div>
            </section>
            <div
                style={{position: 'absolute', top: '1px', lineHeight: '.9em'}}
                className={`ml-3 mb-2 ${selectTxtStyle(colorP, {bold: true})} text-subtitle text-left`}>
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
            selectTxtStyle={selectTxtStyle}
            colorBack={backColorSelect}
        />
    );

    const showPercCircleAndGift = () => (
        showMoreComps &&
        <section id="target---perc-gift">
            <CompLoader
                comp={
                    <div className="animated zoomIn">
                        <AsyncPercCircleAndGift
                            currScore={currScore}
                            classNamePerc={`${needAppForPreview && "enabledLink"}`}
                            maxScore={maxScore}
                            showPercentage={showMoreComps}
                            playBeep={playBeep}
                            colorS={colorS}
                            colorP={colorP}
                            colorBack={backColorSelect}
                        />
                    </div>
                }
                marginY={50}
                size="small"
            />
        </section>
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
                selectTxtStyle={selectTxtStyle}
                colorS={colorS}
                colorP={colorP}
            />
            {showMoreComps &&
                <AsyncProgressMsg
                    currScore={currScore || 0}
                    maxScore={maxScore || 0}
                    playBeep={playBeep}
                    colorBack={backColorSelect}
                    colorS={colorS}
                    selectTxtStyle={selectTxtStyle}
                />
            }
        </div>
    );

    const showSkipIconsBtn = () => (
        currScore >= 30 && !showMoreComps &&
        <div
            className={`${needAppForPreview && "enabledLink"} position-relative container-center animated zoomIn delay-2s`}
            style={{top: '-55px'}}
        >
            <ButtonFab
                position="relative"
                onClick={() => setShowMoreComps(true)}
                title="ver mais"
                iconFontAwesome={<FontAwesomeIcon icon="plus" />}
                iconFontSize="25px"
                variant="extended"
                fontWeight="bolder"
                onMouseOver={() => handlePreload()}
                fontSize=".9em"
                size="large"
                color={currTxtColor(selfThemeSColor)}
                backgroundColor={"var(--themeSDark--" + selfThemeSColor + ")"}
                shadowColor={selfThemeBackColor === "black" ? "white" : "black"}
            />
        </div>
    );

    const showRules = () => (
        showMoreComps &&
        <div className="mb-4">
            <div
                className="target--rules-page container-center position-relative"
                style={{ top: `${needAppForPreview && "15px"}` }}
            >
                <Link to={needAppForCliAdmin ? "/regulamento?client-admin=1" : "/regulamento"}>
                    <div
                        className={`no-text-decoration text-center pressed-to-left`}
                        onClick={playBeep}
                        style={styles.rulesBtn}>
                        <span className={`${selectTxtStyle(backColorSelect, {bold: true})} text-normal`}>
                            Consulte<br />Regras Aqui
                        </span>
                    </div>
                </Link>
            </div>
        </div>
    );

    const showMoreOptionsBtn = () => (
        showMoreComps &&
        <AsyncMoreOptionsBtn
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
                        backgroundColor={'var(--themeSDark--' + backColorSelect + ')'}
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
        <div className={`${needAppForPreview && "disabledLink"} client-user-app-content`}>
            {showGreetingAndNotific()}
            {showAllScores()}
            {showPercCircleAndGift()}
            {showRatingIcons()}
            {showSkipIconsBtn()}
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