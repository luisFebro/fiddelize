import React, { useRef, useState } from "react";
import { Provider } from "context";
import useAuth from "auth/useAuth";
import getColor from "styles/txt";
import useAnimateConfetti from "hooks/animation/useAnimateConfetti";
import useAnimateNumber from "hooks/animation/useAnimateNumber";
import { useVar } from "init/var";
import NotifPermissionBanner from "components/pwa-push-notification/NotifPermissionBanner";
import useDidScroll from "hooks/scroll/useDidScroll";
import useData from "init";
import GreetingAndNotific from "./GreetingAndNotific";
import useGlobal from "./useGlobal";
import BtnBackTestMode from "./test-mode-btn/BtnBackTestMode";
import GroupedAppBar from "./GroupedAppBar";
import PtsBalance from "../balance/PtsBalance";

export default function ClientUserAppContent({
    useBizData,
    needAppForCliAdmin,
    needAppForPreview,
    runName,
    totalNotifications,
    colorP,
    colorSPreview,
    colorBackPreview,
    gameClubPreview,
    firstNamePreview,
    targetPointsPreview,
}) {
    const [showMoreComps, setShowMoreComps] = useState(false);

    const isAuth = useAuth();
    const didUserScroll = useDidScroll();
    const didBeatGame = useVar("didBeatGame");

    const { currGame, currPoints = 100, role } = useData();
    let { firstName } = useData();
    let { themeBackColor, themePColor, themeSColor } = useBizData();
    firstName = firstNamePreview || firstName;
    themePColor = colorP || themePColor;
    themeSColor = colorSPreview || themeSColor;
    themeBackColor = colorBackPreview || themeBackColor;
    const { needDark, txtColor, txtColorStyle } = getColor(themeBackColor);

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
        firstName,
        txtColor,
        playBeep,
        runName,
        didUserScroll,
        currGame,
        currPoints,
        isPreviewMode: needAppForCliAdmin || needAppForPreview,
        needAppForCliAdmin,
        themePColor,
        themeSColor,
        themeBackColor,
        needDark,
        txtColor,
        txtColorStyle,
        gameClubPreview,
        needAppForPreview,
        targetPointsPreview,
    });

    const showAdminTestMsg = () => (
        <section style={{ left: 10, top: "0px", position: "fixed" }}>
            <div className="admin-design-mode d-flex justify-content-center">
                <div>
                    <p className={`m-0 text-small text-center ${txtColor}`}>
                        Admin, funcionalidades
                        <br />
                        desativas no modo design.
                        <br />
                        Somente para <strong>fins visuais</strong>.
                    </p>
                    <style jsx>
                        {`
                            .admin-design-mode {
                                border-radius: 30px;
                                padding: 7px;
                                border: ${needDark
                                    ? "1px solid #000;"
                                    : "1px solid #fff;"};
                            }
                        `}
                    </style>
                </div>
            </div>
        </section>
    );

    return (
        <Provider store={store}>
            <section
                className={`${
                    needAppForPreview && "disabledLink"
                } client-user-app-content`}
            >
                <GreetingAndNotific
                    needAppForPreview={needAppForPreview}
                    needAppForCliAdmin={needAppForCliAdmin}
                    totalNotifications={totalNotifications}
                    firstName={firstName}
                    themeBackColor={themeBackColor}
                    colorP={colorP}
                />
                {showPtsBalance()}
                <GroupedAppBar />
                {backBtnForCliAdmin()}
                <NotifPermissionBanner
                    title="Receba notificações sobre seus benefícios!"
                    subtitle="fique por dentro quando ganhar pontos, descontos e prêmios em tempo real"
                />
                <audio id="appBtn" src="/sounds/app-btn-sound.wav" />
                {needAppForCliAdmin && showAdminTestMsg()}
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
