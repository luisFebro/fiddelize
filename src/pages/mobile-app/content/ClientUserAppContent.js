import React, { useRef, useEffect, useState } from "react";
import { Provider } from "context";
import getDayGreetingBr from "utils/getDayGreetingBr";
import useAuth from "auth/useAuth";
import selectTxtStyle from "utils/biz/selectTxtStyle";
import AsyncBellNotifBtn from "components/notification/AsyncBellNotifBtn";
import "../ellipse.scss";
import useAnimateConfetti from "hooks/animation/useAnimateConfetti";
import useAnimateNumber from "hooks/animation/useAnimateNumber";
import pickCurrChallData from "utils/biz/pickCurrChallData";
import defineCurrChallenge from "utils/biz/defineCurrChallenge";
import getVar, { removeVar } from "init/var";
import useSendSMS from "hooks/sms/useSendSMS";
import useDidDateExpire from "hooks/dates/date-expires/useDidDateExpire";
import NotifPermissionBanner from "components/pwa-push-notification/NotifPermissionBanner";
import useDidScroll from "hooks/scroll/useDidScroll";
import useData from "init";
import useGlobal from "./useGlobal";
import useNotifyCliWonChall from "./hooks/useNotifyCliWonChall";
import BtnBackTestMode from "./test-mode-btn/BtnBackTestMode";
import GroupedAppBar from "./GroupedAppBar";
import AllScores from "../AllScores";

const now = new Date();
const greeting = getDayGreetingBr();

export default function ClientUserAppContent({
    useThisData,
    useBizData,
    needAppForCliAdmin,
    needAppForPreview,
    runName,
    colorP = "default",
    colorS = "default",
    colorBack,
    businessId,
    targetPointsTest,
    clientNameTest,
    totalNotifications,
}) {
    const [showMoreComps, setShowMoreComps] = useState(false);
    const currPointsRef = useRef(null);

    const {
        userId,
        role,
        firstName: firstUserName,
        name: fullName,
        lastPrizeId,
        lastPrizeDate,
        loadingData,
    } = useData();
    const firstName = clientNameTest || firstUserName;

    const {
        currPoints = 0,
        lastPoints,
        totalPurchasePrize,
        totalGeneralPoints,
    } = useThisData();
    const currChall = defineCurrChallenge(totalPurchasePrize);

    const {
        rewardList,
        themeBackColor,
        arePrizesVisible,
        bizWhatsapp,
        bizName,
        bizLogo,
    } = useBizData();
    let { targetPoints = 0, milestoneIcon } = useBizData();

    const pickedObj = pickCurrChallData(rewardList, totalPurchasePrize);
    targetPoints = pickedObj.targetPoints;
    const { mainReward } = pickedObj;

    milestoneIcon = pickedObj.milestoneIcon;
    if (targetPointsTest) {
        targetPoints = Number(targetPointsTest);
    }

    const userBeatChallenge = currPoints >= targetPoints;

    useAlreadyAlertChallenge(currPoints);
    const didUserScroll = useDidScroll();

    const isAuth = useAuth();

    useNotifyCliWonChall(businessId, {
        businessId,
        mainReward,
        fullName,
        targetPoints,
        currChall,
        currPoints,
        bizLogo,
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
        (isAuth && role === "cliente") ||
        needAppForCliAdmin ||
        needAppForPreview;
    const numberOptions = {
        trigger: triggerNumberAnima,
        callback: setShowMoreComps,
    };
    useAnimateNumber(currPointsRef.current, currPoints, numberOptions);

    const backColorSelect = colorBack || themeBackColor || colorP;
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
            currPointsRef={currPointsRef}
            currPoints={currPoints}
            showPercentage={showMoreComps}
            lastPoints={lastPoints}
            needAppForPreview={needAppForPreview}
            selectTxtStyle={selectTxtStyle}
            colorBack={backColorSelect}
            colorS={colorS}
            totalGeneralPoints={totalGeneralPoints}
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
        targetPoints,
        currChall,
        currPoints,
        playBeep,
        arePrizesVisible,
        prizeDesc: mainReward,
        milestoneIcon,
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
function useAlreadyAlertChallenge(currPoints) {
    useEffect(() => {
        if (!currPoints) {
            (async () => {
                const gotValue = await getVar("alreadyAlertChallenge");
                if (!gotValue) return;

                await removeVar("alreadyAlertChallenge");
                await removeVar("pendingChall");
            })();
        }
    }, [currPoints]);
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
    currPoints >= 30 &&
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
                    themeBackColor === "black" ? "white" : "black"
                }
            />
        </div>
    );

const totalChallengesWon = Math.floor(currPoints / targetPoints);
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
            trophyIcon: milestoneIcon,
            thisRole: role || "cliente",
        };
        getVar("pendingChall").then((resPending) => {
            let thisTargetPoints = targetPoints;
            if (resPending) {
                thisTargetPoints = pickedObjForPending.targetPoints;
            }
            readPurchaseHistory(userId, thisTargetPoints, options);
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
