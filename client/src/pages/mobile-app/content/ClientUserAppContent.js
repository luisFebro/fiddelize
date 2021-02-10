import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import getDayGreetingBr from "../../../utils/getDayGreetingBr";
import { useAuthUser } from "../../../hooks/useAuthUser";
import selectTxtStyle from "../../../utils/biz/selectTxtStyle";
import "../ellipse.scss";
import AsyncBellNotifBtn from "../../../components/notification/AsyncBellNotifBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { currTxtColor } from "../../../utils/biz/selectTxtStyle";
import ButtonFab from "../../../components/buttons/material-ui/ButtonFab";
import useElemShowOnScroll from "../../../hooks/scroll/useElemShowOnScroll";
import CompLoader from "../../../components/CompLoader";
import useAnimateConfetti from "../../../hooks/animation/useAnimateConfetti";
import useAnimateNumber from "../../../hooks/animation/useAnimateNumber";
import pickCurrChallData from "../../../utils/biz/pickCurrChallData";
import defineCurrChallenge from "../../../utils/biz/defineCurrChallenge";
import useCountNotif from "../../../hooks/notification/useCountNotif";
import useSendNotif from "../../../hooks/notification/useSendNotif";
import useAPI, { readPrizes } from "../../../hooks/api/useAPI";
import { getVar, removeVar, setVar } from "../../../hooks/storage/useVar";
import { readPurchaseHistory } from "../../../redux/actions/userActions";
import useSendSMS from "../../../hooks/sms/useSendSMS";
import useDidDateExpire from "../../../hooks/dates/date-expires/useDidDateExpire";
import BtnBackTestMode from "./test-mode-btn/BtnBackTestMode.js";
import useData from "../../../hooks/useData";
// import useCount from "../../../hooks/useCount";

// APP COMPONENTS
import RatingIcons from "../RatingIcons";
import AsyncProgressMsg from "../AsyncProgressMsg";
import AsyncMoreOptionsBtn from "../AsyncMoreOptionsBtn";
import AllScores from "../AllScores";
import AsyncPercCircleAndGift from "../AsyncPercCircleAndGift";
// END APP COMPONENTS

const styles = {
    rulesBtn: {
        width: "130px",
        color: "var(--mainWhite)",
        cursor: "pointer",
    },
};

const now = new Date();
const getAutoSMSObj = ({
    needMissingMsg,
    userBeatChallenge,
    lastPrizeId,
    businessId,
    firstName,
    currChall,
    bizWhatsapp,
}) => ({
    trigger: needMissingMsg
        ? needMissingMsg
        : Boolean(userBeatChallenge && lastPrizeId),
    serviceType: needMissingMsg ? "missingPurchase" : "finishedChall",
    userId: businessId,
    smsId: needMissingMsg ? now.getMonth() : lastPrizeId,
    customMsg: needMissingMsg
        ? ""
        : `CONCLUSÃO DE DESAFIO - ${firstName}, {
              addSurname: true,
          })} acabou de concluir desafio N.º ${currChall}.`,
    contactList: [
        {
            name: needMissingMsg ? firstName : "Você",
            phone: bizWhatsapp,
        },
    ],
});

const greeting = getDayGreetingBr();

export default function ClientUserAppContent({
    useProfile,
    useClientUser,
    useClientAdmin,
    needAppForCliAdmin,
    needAppForPreview,
    runName,
    colorP,
    colorS,
    colorBack,
    businessId,
    rewardScoreTest,
    clientNameTest,
}) {
    const [showMoreComps, setShowMoreComps] = useState(false);
    const currScoreRef = useRef(null);

    if (!colorP) {
        colorP = "default";
    }
    if (!colorS) {
        colorS = "default";
    }
    let { role, phone } = useProfile();
    let [_id, fullName, firstName] = useData(["userId", "name", "firstName"]);
    firstName = clientNameTest || firstName;
    const userIdLoading = Boolean(_id === "...");

    const totalNotifications = useCountNotif(_id, {
        role,
        forceCliUser: true,
        trigger: !userIdLoading,
    });

    let {
        currScore,
        lastScore,
        totalPurchasePrize,
        totalGeneralScore,
    } = useClientUser();
    const currChall = defineCurrChallenge(totalPurchasePrize);

    let {
        maxScore,
        rewardList,
        rewardDeadline,
        selfMilestoneIcon,
        selfThemeBackColor,
        arePrizesVisible,
        bizWhatsapp,
        // bizName,
    } = useClientAdmin();

    const pickedObj = pickCurrChallData(rewardList, totalPurchasePrize);
    maxScore = pickedObj.rewardScore;
    const mainReward = pickedObj.mainReward;
    selfMilestoneIcon = pickedObj.selfMilestoneIcon;
    if (rewardScoreTest) {
        maxScore = Number(rewardScoreTest);
    }

    const userBeatChallenge = currScore >= maxScore;

    const totalChallengesWon = Math.floor(currScore / maxScore);
    const pickedObjForPending = React.useMemo(
        () => pickCurrChallData(rewardList, totalPurchasePrize + 1),
        // eslint-disable-next-line
        []
    ); // do not include params to run the first right result.
    useEffect(() => {
        // read client user data to make sure prizes are generated if user has multiple prizes won in the row...
        const key = "challengesWon";

        if (totalChallengesWon >= 2) {
            setVar({ [key]: totalChallengesWon });
        }

        if (userIdLoading) return;

        getVar(key).then((gotValue) => {
            const options = {
                trigger: gotValue,
                noResponse: true,
                prizeDesc: mainReward,
                trophyIcon: selfMilestoneIcon,
                thisRole: role || "cliente",
            };
            getVar("pendingChall").then((resPending) => {
                let thisMaxScore = maxScore;
                if (resPending) {
                    thisMaxScore = pickedObjForPending.rewardScore;
                }
                readPurchaseHistory(_id, thisMaxScore, options);
            });

            if (gotValue && !userBeatChallenge) {
                removeVar(key);
            }
        });
        // eslint-disable-next-line
    }, [
        userIdLoading,
        _id,
        userBeatChallenge,
        totalChallengesWon,
        pickedObjForPending,
    ]);

    useEffect(() => {
        if (!currScore) {
            getVar("alreadyAlertChallenge").then((gotValue) => {
                if (gotValue) {
                    removeVar("alreadyAlertChallenge").then((res) => {
                        removeVar("pendingChall");
                    });
                }
            });
        }
    }, [currScore]);

    const { isAuthUser } = useAuthUser();
    // useCount("ClientUserAppContent.js"); // RT = 3 before = /
    const { data: lastPrizeId } = useAPI({
        url: readPrizes(_id),
        params: { lastPrizeId: true, thisRole: "cliente" },
        trigger: !needAppForPreview && !userIdLoading,
    });
    const challNotifOptions = React.useCallback(
        () => ({
            trigger: Boolean(userBeatChallenge && lastPrizeId),
            storage: { key: "alreadyAlertChallenge", value: currChall },
            senderId: _id,
            role: "cliente-admin",
            subtype: "clientWonChall",
            content: `prizeId:${lastPrizeId};rewardScore:${maxScore};currScore:${currScore};totalPrizes:${totalPurchasePrize};currChall:${currChall};clientFullName:${fullName};prizeDesc:${mainReward};phone:${phone};`,
        }),
        // eslint-disable-next-line
        [userBeatChallenge, lastPrizeId, _id]
    );
    useSendNotif(businessId, "challenge", challNotifOptions());

    const needMissingMsg = useDidDateExpire({
        userId: _id,
        trigger: !needAppForPreview && !userIdLoading,
    });
    const autoSMSMissingPurchase = getAutoSMSObj({
        needMissingMsg,
        businessId,
        firstName,
        bizWhatsapp,
    });
    useSendSMS(autoSMSMissingPurchase);

    const autoSMSObj = getAutoSMSObj({
        userBeatChallenge,
        lastPrizeId,
        businessId,
        firstName,
        currChall,
        bizWhatsapp,
    });
    useSendSMS(autoSMSObj);

    const confettiOptions = React.useCallback(
        () => ({ trigger: userBeatChallenge, showMoreComps }),
        [userBeatChallenge, showMoreComps]
    );
    useAnimateConfetti(confettiOptions());
    const triggerNumberAnima =
        (isAuthUser && role === "cliente") ||
        needAppForCliAdmin ||
        needAppForPreview;
    const numberOptions = {
        trigger: triggerNumberAnima,
        callback: setShowMoreComps,
    };
    useAnimateNumber(currScoreRef.current, currScore, numberOptions);
    const showMoreBtn = useElemShowOnScroll(".target--rules-page", {
        tSpan: 20,
    });

    // UTILS
    function playBeep() {
        const elem = document.querySelector("#appBtn");
        elem.play();
    }

    const handlePreload = () => {
        // if user mouse over the "mostrar mais" btn
        AsyncPercCircleAndGift.preload();
    };
    // END UTILS
    const backColorSelect = colorBack || selfThemeBackColor || colorP;
    const selectedTxtStyle = selectTxtStyle(backColorSelect, { bold: true });

    const showGreetingAndNotific = () => (
        <section className="mt-3 position-relative animated slideInLeft slow">
            <section className="position-relative">
                <div
                    className="ellipse"
                    style={{
                        backgroundColor: "var(--themePLight--" + colorP + ")",
                        width: needAppForPreview && "21.8em",
                    }}
                ></div>
                <div className={`${needAppForPreview && "disabledLink"}`}>
                    <AsyncBellNotifBtn
                        position="absolute"
                        forceCliUser={true}
                        top={21}
                        left={needAppForPreview ? 258 : 270}
                        notifBorderColor={
                            "var(--themeBackground--" + backColorSelect + ")"
                        }
                        notifBackColor={
                            backColorSelect === "red"
                                ? "var(--themePLight--black)"
                                : "var(--expenseRed)"
                        }
                        badgeValue={totalNotifications}
                    />
                </div>
            </section>
            <div
                style={{
                    position: "absolute",
                    top: "21px",
                    lineHeight: ".9em",
                }}
                className={`ml-3 mb-2 ${selectTxtStyle(colorP, {
                    bold: true,
                })} text-subtitle text-left`}
            >
                {greeting},
                <br />
                <span className="text-title">{`${firstName}!`}</span>
            </div>
        </section>
    );

    const showAllScores = () => (
        <AllScores
            userName={firstName}
            userId={_id}
            currScoreRef={currScoreRef}
            currScore={currScore}
            showPercentage={showMoreComps}
            lastScore={lastScore}
            needAppForPreview={needAppForPreview}
            selectTxtStyle={selectTxtStyle}
            colorBack={backColorSelect}
            colorS={colorS}
            totalGeneralScore={totalGeneralScore}
            totalPurchasePrize={totalPurchasePrize}
        />
    );

    const showPercCircleAndGift = () =>
        showMoreComps && (
            <section id="target---perc-gift">
                <CompLoader
                    comp={
                        <div className="animated zoomIn">
                            <AsyncPercCircleAndGift
                                currScore={currScore}
                                prizeDesc={mainReward}
                                currChall={currChall}
                                userId={_id}
                                arePrizesVisible={arePrizesVisible}
                                rewardDeadline={rewardDeadline}
                                userName={firstName}
                                classNamePerc={`${
                                    needAppForPreview && "enabledLink"
                                }`}
                                maxScore={maxScore}
                                showPercentage={showMoreComps}
                                playBeep={playBeep}
                                colorS={colorS}
                                colorP={colorP}
                                colorBack={backColorSelect}
                            />
                        </div>
                    }
                    marginY={10}
                    size="small"
                />
            </section>
        );

    const showRatingIcons = () => (
        <div
            style={{ margin: `40px ${needAppForPreview ? "-10px" : "0"} 80px` }}
            className={`${needAppForPreview && "enabledLink"}`}
        >
            <RatingIcons
                score={currScore}
                maxScore={maxScore || 0}
                selfMilestoneIcon={selfMilestoneIcon}
                runName={runName}
                selectTxtStyle={selectTxtStyle}
                colorS={colorS}
                colorBack={backColorSelect}
                colorP={colorP}
            />
            {showMoreComps && (
                <AsyncProgressMsg
                    currScore={currScore || 0}
                    currChall={currChall}
                    maxScore={maxScore || 0}
                    playBeep={playBeep}
                    colorBack={backColorSelect}
                    colorS={colorS}
                    selectTxtStyle={selectTxtStyle}
                />
            )}
        </div>
    );

    const handleMoreComps = () => {
        setShowMoreComps(true);
    };

    const thisCurrTxtColor = currTxtColor(colorS);
    const showSkipIconsBtn = () =>
        currScore >= 30 &&
        !showMoreComps && (
            <div
                className={`${
                    needAppForPreview && "enabledLink"
                } position-relative container-center animated zoomIn delay-2s`}
                style={{ top: "-55px" }}
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
                    backgroundColor={"var(--themeSDark--" + colorS + ")"}
                    shadowColor={
                        selfThemeBackColor === "black" ? "white" : "black"
                    }
                />
            </div>
        );

    const showRules = () =>
        showMoreComps && (
            <div className="mb-4">
                <div
                    className="target--rules-page container-center position-relative"
                    style={{ top: `${needAppForPreview && "15px"}` }}
                >
                    <Link
                        to={
                            needAppForCliAdmin
                                ? "/regulamento?client-admin=1"
                                : "/regulamento"
                        }
                    >
                        <div
                            className={`no-text-decoration text-center pressed-to-left`}
                            onClick={playBeep}
                            style={styles.rulesBtn}
                        >
                            <span className={`${selectedTxtStyle} text-normal`}>
                                Consulte
                                <br />
                                Regras Aqui
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
        );

    const showMoreOptionsBtn = () =>
        showMoreComps && (
            <AsyncMoreOptionsBtn
                playBeep={playBeep}
                showMoreBtn={showMoreBtn}
                userName={firstName}
                needAppForCliAdmin={needAppForCliAdmin}
                needAppForPreview={needAppForPreview}
                colorS={colorS}
            />
        );

    const backBtnForCliAdmin = () => (
        <BtnBackTestMode
            isActive={needAppForCliAdmin ? true : false}
            btnBackColor={backColorSelect}
        />
    );

    return (
        <div
            className={`${
                needAppForPreview && "disabledLink"
            } client-user-app-content`}
        >
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

ClientUserAppContent.whyDidYouRender = false;
/* COMMENTS
n1:
a) React.useCallback is essential to avoid to render + 15 times at start
b) When user log in, RT is 36
*/
