import React, { useRef, useEffect, useState } from "react";
import { Provider } from "context";
import getDayGreetingBr from "utils/getDayGreetingBr";
import { useAuthUser } from "hooks/useAuthUser";
import selectTxtStyle from "utils/biz/selectTxtStyle";
import AsyncBellNotifBtn from "components/notification/AsyncBellNotifBtn";
import "../ellipse.scss";
import useAnimateConfetti from "hooks/animation/useAnimateConfetti";
import useAnimateNumber from "hooks/animation/useAnimateNumber";
import pickCurrChallData from "utils/biz/pickCurrChallData";
import defineCurrChallenge from "utils/biz/defineCurrChallenge";
import { getVar, removeVar } from "hooks/storage/useVar";
import useSendSMS from "hooks/sms/useSendSMS";
import useDidDateExpire from "hooks/dates/date-expires/useDidDateExpire";
import NotifPermissionBanner from "components/pwa-push-notification/NotifPermissionBanner";
import useDidScroll from "hooks/scroll/useDidScroll";
import useData from "hooks/useData";
import useGlobal from "./useGlobal";
import useNotifyCliWonChall from "./hooks/useNotifyCliWonChall";
import BtnBackTestMode from "./test-mode-btn/BtnBackTestMode";
import GroupedAppBar from "./GroupedAppBar";
import AllScores from "../AllScores";

const now = new Date();
const greeting = getDayGreetingBr();

export default function ClientUserAppContent({
    useProfile,
    useBizData,
    needAppForCliAdmin,
    needAppForPreview,
    runName,
    colorP = "default",
    colorS = "default",
    colorBack,
    businessId,
    rewardScoreTest,
    clientNameTest,
    totalNotifications,
}) {
    const [showMoreComps, setShowMoreComps] = useState(false);
    const currScoreRef = useRef(null);

    // LESSON: these data are being used here since in the parent useData returns null in the first boot up for cli-user
    const [
        userId,
        role,
        firstUserName,
        fullName,
        lastPrizeId,
        lastPrizeDate,
    ] = useData([
        "userId",
        "role",
        "firstName",
        "name",
        "lastPrizeId",
        "lastPrizeDate",
    ]);
    const loadingData = userId === "...";
    const firstName = clientNameTest || firstUserName;

    const {
        currScore = 0,
        lastScore,
        totalPurchasePrize,
        totalGeneralScore,
    } = useProfile();
    const currChall = defineCurrChallenge(totalPurchasePrize);

    const {
        rewardList,
        selfThemeBackColor,
        arePrizesVisible,
        bizWhatsapp,
        bizName,
        selfBizLogoImg,
    } = useBizData();
    let { maxScore = 0, selfMilestoneIcon } = useBizData();

    const pickedObj = pickCurrChallData(rewardList, totalPurchasePrize);
    maxScore = pickedObj.rewardScore;
    const { mainReward } = pickedObj;

    selfMilestoneIcon = pickedObj.selfMilestoneIcon;
    if (rewardScoreTest) {
        maxScore = Number(rewardScoreTest);
    }

    const userBeatChallenge = currScore >= maxScore;

    useAlreadyAlertChallenge(currScore);
    const didUserScroll = useDidScroll();

    const { isAuthUser } = useAuthUser();

    useNotifyCliWonChall(businessId, {
        businessId,
        mainReward,
        fullName,
        maxScore,
        currChall,
        currScore,
        selfBizLogoImg,
        lastPrizeId,
        totalPurchasePrize,
        senderId: userId,
        // trigger
        userIdLoading: loadingData,
        userBeatChallenge,
        playBeep,
    });

    const needMissingMsg = useDidDateExpire({
        dateToExpire: lastPrizeDate,
        userId,
        trigger: !needAppForPreview && !loadingData && lastPrizeDate,
    });

    // this can be soon depracated with a push notification.
    const autoSMSMissingPurchase = getAutoSMSObj({
        needMissingMsg,
        businessId,
        firstName,
        bizWhatsapp,
    });
    useSendSMS(autoSMSMissingPurchase);

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

    const backColorSelect = colorBack || selfThemeBackColor || colorP;
    const selectedTxtStyle = selectTxtStyle(backColorSelect, { bold: true });

    const showGreetingAndNotific = () => (
        <section className="mt-3 position-relative">
            <section className="position-relative">
                <div
                    className="ellipse"
                    style={{
                        backgroundColor: `var(--themePLight--${colorP})`,
                        width: needAppForPreview && "21.8em",
                    }}
                />
                <div className={`${needAppForPreview && "disabledLink"}`}>
                    <AsyncBellNotifBtn
                        position="absolute"
                        forceCliUser
                        top={21}
                        left={needAppForPreview ? 258 : 270}
                        notifBorderColor={`var(--themeBackground--${backColorSelect})`}
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
                <span className="text-title">{`${
                    !firstName ? "..." : firstName
                }!`}</span>
            </div>
        </section>
    );

    const showAllScores = () => (
        <AllScores
            userName={firstName}
            userId={userId}
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

    const backBtnForCliAdmin = () => (
        <BtnBackTestMode
            isActive={!!needAppForCliAdmin}
            btnBackColor={backColorSelect}
        />
    );

    const store = useGlobal({
        colorP,
        colorS,
        colorBack: backColorSelect,
        needAppForCliAdmin,
        needAppForPreview,
        userName: firstName,
        userId,
        selectedTxtStyle,
        selectTxtStyle,
        maxScore,
        currChall,
        currScore,
        playBeep,
        arePrizesVisible,
        prizeDesc: mainReward,
        selfMilestoneIcon,
        runName,
        lastPrizeDate,
        didUserScroll,
        bizName,
    });

    return (
        <Provider store={store}>
            <section
                className={`${
                    needAppForPreview && "disabledLink"
                } client-user-app-content`}
            >
                {showGreetingAndNotific()}
                {showAllScores()}
                <GroupedAppBar />
                {backBtnForCliAdmin()}
                <NotifPermissionBanner
                    title="Receba notificações sobre seus benefícios!"
                    subtitle="fique por dentro quando ganhar pontos, descontos e prêmios em tempo real"
                />
                <audio id="appBtn" src="/sounds/app-btn-sound.wav" />
                <div
                    style={{ position: "absolute", bottom: 0, left: "auto" }}
                    id="bottomTabContentView"
                />
            </section>
        </Provider>
    );
}

// HELPERS
function playBeep() {
    const elem = document.querySelector("#appBtn");
    elem.play();
}

function getAutoSMSObj(data) {
    const { needMissingMsg } = data;

    return {
        trigger: needMissingMsg,
        serviceType: "missingPurchase",
        userId: data.businessId,
        smsId: now.getMonth(),
        customMsg: "",
        contactList: [
            {
                name: data.firstName,
                phone: data.bizWhatsapp,
            },
        ],
    };
}
// END HELPERS

// HOOKS
function useAlreadyAlertChallenge(currScore) {
    useEffect(() => {
        if (!currScore) {
            (async () => {
                const gotValue = await getVar("alreadyAlertChallenge");
                if (!gotValue) return;

                await removeVar("alreadyAlertChallenge");
                await removeVar("pendingChall");
            })();
        }
    }, [currScore]);
}

// END HOOKS

/* COMMENTS
n1:
a) React.useCallback is essential to avoid to render + 15 times at start
b) When user log in, RT is 36
*/

/* ARCHIVES
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
            } position-relative container-center`}
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
                onMouseOver={null}
                fontSize=".9em"
                size="large"
                color={thisCurrTxtColor}
                backgroundColor={`var(--themeSDark--${colorS})`}
                shadowColor={
                    selfThemeBackColor === "black" ? "white" : "black"
                }
            />
        </div>
    );

const totalChallengesWon = Math.floor(currScore / maxScore);
const pickedObjForPending = React.useMemo(
    () => pickCurrChallData(rewardList, totalPurchasePrize + 1),
    []
); // do not include params to run the first right result.
// read client user data to make sure prizes are generated if user has multiple prizes won in the row...
useEffect(() => {
    const key = "challengesWon";

    if (totalChallengesWon >= 2) {
        setVar({ [key]: totalChallengesWon });
    }

    if (loadingData) return;

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
            readPurchaseHistory(userId, thisMaxScore, options);
        });

        if (gotValue && !userBeatChallenge) {
            removeVar(key);
        }
    });
}, [
    loadingData,
    userId,
    userBeatChallenge,
    totalChallengesWon,
    pickedObjForPending,
]);


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
                        className="no-text-decoration text-center pressed-to-left"
                        onClick={playBeep}
                        style={{
                            width: "130px",
                            color: "var(--mainWhite)",
                            cursor: "pointer",
                        }}
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

*/
