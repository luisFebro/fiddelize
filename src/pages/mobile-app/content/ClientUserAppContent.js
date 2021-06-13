import React, { useRef, useState } from "react";
import { Provider } from "context";
import getDayGreetingBr from "utils/getDayGreetingBr";
import useAuth from "auth/useAuth";
import getColor from "styles/txt";
import AsyncBellNotifBtn from "components/notification/AsyncBellNotifBtn";
import "../ellipse.scss";
import useAnimateConfetti from "hooks/animation/useAnimateConfetti";
import useAnimateNumber from "hooks/animation/useAnimateNumber";
import { useVar } from "init/var";
import NotifPermissionBanner from "components/pwa-push-notification/NotifPermissionBanner";
import useDidScroll from "hooks/scroll/useDidScroll";
import useData from "init";
import useGlobal from "./useGlobal";
import BtnBackTestMode from "./test-mode-btn/BtnBackTestMode";
import GroupedAppBar from "./GroupedAppBar";
import PtsBalance from "../balance/PtsBalance";

const greeting = getDayGreetingBr();

export default function ClientUserAppContent({
    useBizData,
    needAppForCliAdmin,
    needAppForPreview,
    runName,
    colorP = "default",
    totalNotifications,
}) {
    const [showMoreComps, setShowMoreComps] = useState(false);

    const isAuth = useAuth();
    const didUserScroll = useDidScroll();
    const didBeatGame = useVar("didBeatGame");

    const { currPoints = 100, firstName, role } = useData();
    const { themeBackColor, txtColor } = useBizData();

    const confettiOptions = React.useCallback(
        () => ({ trigger: didBeatGame, showMoreComps }),
        [didBeatGame, showMoreComps]
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
    const currPointsRef = useRef(null);
    useAnimateNumber(currPointsRef.current, currPoints, numberOptions);

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
                className={`ml-3 mb-2 ${
                    getColor(colorP).txtColor
                } text-subtitle text-left`}
            >
                {greeting},
                <br />
                <span className="text-title">{`${firstName}!`}</span>
            </div>
        </section>
    );

    const showPtsBalance = () => (
        <PtsBalance
            showMoreComps={showMoreComps}
            currPointsRef={currPointsRef}
            txtColor={txtColor}
        />
    );

    const backBtnForCliAdmin = () => (
        <BtnBackTestMode
            isActive={!!needAppForCliAdmin}
            btnBackColor={themeBackColor}
        />
    );

    const store = useGlobal({
        needAppForCliAdmin,
        needAppForPreview,
        txtColor,
        playBeep,
        runName,
        didUserScroll,
    });

    return (
        <Provider store={store}>
            <section
                className={`${
                    needAppForPreview && "disabledLink"
                } client-user-app-content`}
            >
                {showGreetingAndNotific()}
                {showPtsBalance()}
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
// END HELPERS

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
