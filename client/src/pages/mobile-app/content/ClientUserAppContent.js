import React, { useRef, useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import getDayGreetingBr from '../../../utils/getDayGreetingBr';
import { useAuthUser } from '../../../hooks/useAuthUser';
import { useStoreDispatch } from 'easy-peasy';
import getFirstName from '../../../utils/string/getFirstName';
import selectTxtStyle from '../../../utils/biz/selectTxtStyle';
import "../ellipse.css";
import { setRun } from '../../../hooks/useRunComp';
import RadiusBtn from '../../../components/buttons/RadiusBtn';
import "./style.scss";
import BellNotifBtn from '../../../components/notification/BellNotifBtn';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { currTxtColor } from '../../../utils/biz/selectTxtStyle';
import ButtonFab from '../../../components/buttons/material-ui/ButtonFab';
import useElemShowOnScroll from '../../../hooks/scroll/useElemShowOnScroll';
import useCount from '../../../hooks/useCount';
import CompLoader from '../../../components/CompLoader';
import useAnimateConfetti from '../../../hooks/animation/useAnimateConfetti';
import useAnimateNumber from '../../../hooks/animation/useAnimateNumber';
import pickCurrChallData from '../../../utils/biz/pickCurrChallData';
import defineCurrChallenge from '../../../utils/biz/defineCurrChallenge';

// APP COMPONENTS
import RatingIcons from '../RatingIcons';
import AsyncProgressMsg from '../AsyncProgressMsg' ;
import AsyncMoreOptionsBtn from '../AsyncMoreOptionsBtn';
import AllScores from '../AllScores';
import AsyncPercCircleAndGift from '../AsyncPercCircleAndGift';
// END APP COMPONENTS

const styles = {
    rulesBtn: {
        width: '130px',
        color: "var(--mainWhite)",
        cursor: "pointer",
    }
}

const greeting = getDayGreetingBr();

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
    const [showMoreComps, setShowMoreComps] = useState(false);
    const currScoreRef = useRef(null);

    if(!colorP) { colorP = "default" }
    if(!colorS) { colorS = "default" }
    let { role, name } = useProfile();
    name ? name = getFirstName(name) : name = "cliente";
    let { currScore, lastScore, totalPurchasePrize  } = useClientUser();
    const currChall = defineCurrChallenge(totalPurchasePrize);
    let { maxScore, bizCodeName, rewardList, selfMilestoneIcon, selfThemeSColor, selfThemeBackColor } = useClientAdmin();
    const pickedObj = pickCurrChallData(rewardList, totalPurchasePrize);
    if(rewardScoreTest) { maxScore = Number(rewardScoreTest); }
    maxScore = pickedObj.rewardScore
    selfMilestoneIcon = pickedObj.selfMilestoneIcon
    const userBeatChallenge = currScore >= maxScore;

    const { isAuthUser } = useAuthUser();
    useCount("ClientUserAppContent.js"); // RT = 3 before = /
    const confettiOptions = React.useCallback(() => ({ trigger: userBeatChallenge, showMoreComps }), [userBeatChallenge, showMoreComps])
    useAnimateConfetti(confettiOptions());
    const triggerNumberAnima = isAuthUser && role === "cliente" || needAppForCliAdmin || needAppForPreview;
    const numberOptions = { trigger: triggerNumberAnima, callback: setShowMoreComps }
    useAnimateNumber(currScoreRef.current, currScore, numberOptions);
    const dispatch = useStoreDispatch();
    const showMoreBtn = useElemShowOnScroll('.target--rules-page', { tSpan: 20 });
    // const targetElem = useRef(null); // withObserver does not track right away, there is a delay...
    // multi scroll dection does not work for now...
    // const showPercGiftComp = useElemShowOnScroll("#target---perc-gift");

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
    const selectedTxtStyle = selectTxtStyle(backColorSelect, {bold: true});

    const showGreetingAndNotific = () => (
        <section className="mt-3 position-relative animated slideInLeft slow">
            <section className="position-relative">
                <div className="ellipse" style={{backgroundColor: "var(--themePLight--" + colorP + ")", width: needAppForPreview && '21.8em',}}></div>
                <div className={`${needAppForPreview && "enabledLink"}`}>
                    <BellNotifBtn
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
                {greeting},
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
                    currChall={currChall}
                    maxScore={maxScore || 0}
                    playBeep={playBeep}
                    colorBack={backColorSelect}
                    colorS={colorS}
                    selectTxtStyle={selectTxtStyle}
                />
            }
        </div>
    );

    const handleMoreComps = () => {
        setShowMoreComps(true);
    }

    const thisCurrTxtColor = currTxtColor(selfThemeSColor);
    const showSkipIconsBtn = () => (
        currScore >= 30 && !showMoreComps &&
        <div
            className={`${needAppForPreview && "enabledLink"} position-relative container-center animated zoomIn delay-2s`}
            style={{top: '-55px'}}
        >
            <ButtonFab
                position="relative"
                onClick={handleMoreComps}
                title="ver mais"
                iconFontAwesome={<FontAwesomeIcon icon="plus" />}
                iconFontSize="25px"
                variant="extended"
                fontWeight="bolder"
                onMouseOver={handlePreload}
                fontSize=".9em"
                size="large"
                color={thisCurrTxtColor}
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
                        <span className={`${selectedTxtStyle} text-normal`}>
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

    const handleBackBtnClick = () => {
        setRun(dispatch, "goDash");
        history.push(`/${bizCodeName}/cliente-admin/painel-de-controle`);
    }

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
                        onClick={handleBackBtnClick}
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

/* COMMENTS
n1:
a) React.useCallback is essential to avoid to render + 15 times at start
b) When user log in, RT is 36
*/