import React, { useRef, useEffect, useState } from "react";
import { Provider } from "context";
import getDayGreetingBr from "utils/getDayGreetingBr";
import useAuth from "auth/useAuth";
import selectTxtStyle from "utils/biz/selectTxtStyle";
import AsyncBellNotifBtn from "components/notification/AsyncBellNotifBtn";
import "../ellipse.scss";
import useAnimateConfetti from "hooks/animation/useAnimateConfetti";
import useAnimateNumber from "hooks/animation/useAnimateNumber";
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
    businessId,
    targetPointsTest,
    totalNotifications,
}) {
    const [showMoreComps, setShowMoreComps] = useState(false);
    const currPointsRef = useRef(null);

    const [
        userId,
        role,
        fullName,
        lastPrizeId,
        lastPrizeDate,
        loadingData,
    ] = useData([
        "userId",
        "role",
        "firstName",
        "name",
        "lastPrizeId",
        "lastPrizeDate",
    ]);

    const { firstName, userGame, adminGame } = useData();

    const { currPoints = 0, lastPoints, totalGeneralPoints } = useThisData();
    const currChall = userGame.targetPrize.challN;
    const { milestoneIcon, prizeDesc } = adminGame.targetPrize;
    let { targetPoints } = adminGame.targetPrize;
    if (targetPointsTest) {
        targetPoints = Number(targetPointsTest);
    }

    const {
        themeBackColor,
        arePrizesVisible,
        bizWhatsapp,
        bizName,
        bizLogo,
    } = useBizData();

    const userBeatChallenge = currPoints >= targetPoints;

    useAlreadyAlertChallenge(currPoints);
    const didUserScroll = useDidScroll();

    const isAuth = useAuth();

    useNotifyCliWonChall(businessId, {
        businessId,
        mainReward: prizeDesc,
        fullName,
        targetPoints,
        currChall,
        currPoints,
        bizLogo,
        lastPrizeId,
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

    const selectedTxtStyle = selectTxtStyle(themeBackColor, { bold: true });

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
                        notifBorderColor={`var(--themeBackground--${themeBackColor})`}
                        notifBackColor={
                            themeBackColor === "red"
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
            userId={userId}
            currPointsRef={currPointsRef}
            currPoints={currPoints}
            showMoreComps={showMoreComps}
            lastPoints={lastPoints}
            needAppForPreview={needAppForPreview}
            selectTxtStyle={selectTxtStyle}
            colorBack={themeBackColor}
            colorS={colorS}
            totalGeneralPoints={totalGeneralPoints}
        />
    );

    const backBtnForCliAdmin = () => (
        <BtnBackTestMode
            isActive={!!needAppForCliAdmin}
            btnBackColor={themeBackColor}
        />
    );

    const store = useGlobal({
        targetPoints,
        currChall,
        needAppForCliAdmin,
        needAppForPreview,
        selectedTxtStyle,
        selectTxtStyle,
        playBeep,
        arePrizesVisible,
        prizeDesc,
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

/* TESTS
<section className="TESTS">
    <button type="button" className="test-btn" onClick={handleTest}>
        fire test
    </button>
    <style jsx>{`
        .TESTS {
            margin: 150px 0;
        }
        .test-btn {
            background: var(--themeP);
            color: var(--mainWhite);
        }
    `}
    </style>
</section>

*/
