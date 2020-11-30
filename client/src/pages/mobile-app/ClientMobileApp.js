// 75% of screen and 360 x 588 is the nearest screen size resolution of a common mobile
import React, { useRef, useEffect, useState, Fragment } from "react";
import AsyncLogin from "../../components/auth/AsyncLogin";
import { Link, withRouter } from "react-router-dom";
import { useStoreDispatch } from "easy-peasy";
import { CLIENT_URL } from "../../config/clientUrl";
import lStorage, { needAppRegisterOp } from "../../utils/storage/lStorage";
import AsyncRegisterCliUser from "../../components/auth/AsyncRegisterCliUser";
import {
    useProfile,
    useClientAdmin,
    useClientUser,
} from "../../hooks/useRoleData";
import { updateUser, countField } from "../../redux/actions/userActions";
import { setRun } from "../../hooks/useRunComp";
import { useAuthUser } from "../../hooks/useAuthUser";
import { useAppSystem } from "../../hooks/useRoleData";
import { useRunComp } from "../../hooks/useRunComp";
import ClientUserAppContent from "./content/ClientUserAppContent";
import isThisApp from "../../utils/window/isThisApp";
import AsyncBellNotifBtn from "../../components/notification/AsyncBellNotifBtn";
// import LoadingThreeDots from '../../components/loadingIndicators/LoadingThreeDots';
// import ImageLogo from '../../components/ImageLogo';
import AsyncVersion from "../../_main-app/user-interfaces/version/AsyncVersion";
import useDelay from "../../hooks/useDelay";
import useCount from "../../hooks/useCount";
import CompLoader from "../../components/CompLoader";
import useBackColor from "../../hooks/useBackColor";
import useCountNotif from "../../hooks/notification/useCountNotif";
import useImg, { Img } from "../../hooks/media/useImg";
import useManageProServices from "../../hooks/pro/useManageProServices";
import { getVar, removeVar, store } from "../../hooks/storage/useVar";
import { showSnackbar } from "../../redux/actions/snackbarActions";
import useData from "../../hooks/useData";
import useScrollUp from "../../hooks/scroll/useScrollUp";
import AppTypeBubble from "./start-comps/AppTypeBubble";
import GatewayAndCTAs from "./start-comps/GatewayAndCTAs";
// import AccessSwitcher from "../../components/auth/password/AccessSwitcher";

const needAppRegister = lStorage("getItem", needAppRegisterOp);

const isSmall = window.Helper.isSmallScreen();
const isApp = isThisApp();

const showWelcomeMsg = (dispatch, userName) => {
    getVar("welcomeMsg").then((res) => {
        if (res) {
            showSnackbar(
                dispatch,
                `Olá de volta, ${userName}!`,
                "success",
                2000
            );
            removeVar("welcomeMsg");
        }
    });
};

function ClientMobileApp({ location, history }) {
    const [loginOrRegister, setLoginOrRegister] = useState("login");
    const [url, setUrl] = useState({
        logoBiz: "",
        logoFid: "",
    });

    useScrollUp();
    useManageProServices();
    const dispatch = useStoreDispatch();

    const [userId, rememberAccess, success, role, name, fullName] = useData([
        "userId",
        "rememberAccess",
        "success",
        "role",
        "firstName",
        "name",
    ]);
    const loadingData = Boolean(rememberAccess === "...");

    let { isAuthUser } = useAuthUser();
    isAuthUser = isAuthUser || (success !== "..." && success);

    const { roleWhichDownloaded, businessId } = useAppSystem();

    // MAIN VARIABLES
    // # query
    const searchQuery = location.search;
    const needAppForCliAdmin = searchQuery.includes("client-admin=1");
    const isUrlAdmin = searchQuery.indexOf("abrir=1&admin=1") !== -1;
    // # roles
    const isStaff = role === "cliente-membro" || role === "cliente-admin";
    let isCliUser = role === "cliente" || roleWhichDownloaded === "cliente";

    let isCliAdmin =
        role === "cliente-admin" || roleWhichDownloaded === "cliente-admin";

    // # auth
    const isSessionOver = !success || !localStorage.getItem("token");
    const needStaffLogout = isStaff && isSessionOver && rememberAccess;

    if (needAppForCliAdmin) {
        isCliAdmin = false;
        isCliUser = true;
    }
    const accessCheck = !isStaff || (!loadingData && !rememberAccess);
    // END MAIN VARIABLES

    useEffect(() => {
        if (!loadingData) {
            showWelcomeMsg(dispatch, name);
        }
    }, [loadingData, name]);

    const {
        bizCodeName,
        selfBizLogoImg,
        selfThemePColor,
        selfThemeSColor,
        selfThemeBackColor,
    } = useClientAdmin();
    const { currScore } = useClientUser();

    const logoBiz = useImg(url.logoBiz, {
        trigger: url.logoBiz,
        coll: "logos",
        key: "app_biz_logo",
    });
    const logoFid = useImg(url.logoFid, {
        trigger: url.logoFid,
        coll: "logos",
        key: "app_fiddelize_logo",
    });

    const logoSrc = logoBiz ? logoBiz : logoFid;

    const { runName } = useRunComp();
    const versionReady = useDelay(2000);
    const totalNotifications = useCountNotif(userId, {
        role,
        trigger: !loadingData,
    });
    useCount("ClientMobileApp.js"); // RT= 72 after login cli-use
    useBackColor(`var(--themeBackground--${selfThemeBackColor})`);

    useEffect(() => {
        if (isCliUser && !loadingData) {
            countField(userId, { field: "clientUserData.totalVisits" });
        }
    }, [userId, loadingData, isCliUser]);

    useEffect(() => {
        if (runName === "logout") {
            history.push("/mobile-app");
        }
    }, [runName]);

    useEffect(() => {
        if (needAppRegister) {
            setLoginOrRegister("register");
            // this is set to false just after registration with setStorageRegisterDone.
        }
    }, [needAppRegister]);

    const needClientLogo =
        (isApp && selfBizLogoImg) || (isAuthUser && selfBizLogoImg);
    const handleLogoSrc = () => {
        if (needClientLogo) {
            return setUrl({ ...url, logoBiz: selfBizLogoImg });
        } else {
            return setUrl({ ...url, logoFid: `/img/official-logo-name.png` });
        }
    };
    useEffect(() => {
        handleLogoSrc();
    }, [needClientLogo]);

    const showLogo = () => {
        const isSquared =
            isApp && selfBizLogoImg && selfBizLogoImg.includes("h_100,w_100");

        return (
            <div className="container-center">
                <Img
                    src={logoSrc}
                    className="animated zoomIn slow"
                    style={{ position: "relative", margin: "15px 0" }}
                    width={isSquared ? 100 : 190}
                    height={isSquared ? 100 : 85}
                />
            </div>
        );
    };

    const showLogin = () => (
        <Fragment>
            <CompLoader
                width={200}
                height={300}
                comp={
                    <div
                        className="container-center position-relative"
                        style={{ top: role === "cliente-admin" ? -78 : 10 }}
                    >
                        <AsyncLogin
                            setLoginOrRegister={setLoginOrRegister}
                            rootClassname="mt-5 mb-3"
                        />
                    </div>
                }
            />
        </Fragment>
    );

    const showRegister = (needLoginBtn, needSetFunc) => (
        <Fragment>
            <p
                className="mx-2 mt-3 text-normal font-weight-bold text-center text-white"
                style={{ marginBottom: 100 }}
            >
                Acumule pontos. Supere Desafios. Ganhe prêmios no jogo de
                compras feito para você!
            </p>
            <CompLoader
                width={200}
                height={300}
                comp={
                    <div className="position-relative" style={{ top: -120 }}>
                        <AsyncRegisterCliUser
                            setLoginOrRegister={setLoginOrRegister || true}
                            needLoginBtn={needLoginBtn}
                        />
                    </div>
                }
            />
        </Fragment>
    );

    const showNotificationBell = () => (
        <div className="container-center">
            <AsyncBellNotifBtn
                position="relative"
                top={-60}
                left={0}
                notifBorderColor={
                    "var(--themeBackground--" + selfThemeBackColor + ")"
                }
                notifBackColor={
                    selfThemeBackColor === "red"
                        ? "var(--themePLight--black)"
                        : "var(--expenseRed)"
                }
                badgeValue={totalNotifications}
            />
        </div>
    );

    const handleConnectedStatusClick = () => {
        setRun(dispatch, "goDash");
    };

    const conditionRegister =
        loginOrRegister === "register" && showRegister(true);
    const conditionLogin =
        loginOrRegister === "login" && accessCheck && showLogin();

    return (
        <div
            style={{ overflowX: "hidden" }}
            className={`theme-back--${selfThemeBackColor}`}
        >
            <span className="text-right text-white for-version-test">{""}</span>
            {showLogo()}
            <AppTypeBubble
                role={role}
                loadingAccess={loadingData}
                roleWhichDownloaded={roleWhichDownloaded}
                isUrlAdmin={isUrlAdmin}
                needAppForCliAdmin={needAppForCliAdmin}
                selfThemePColor={selfThemePColor}
                isAuthUser={isAuthUser}
            />

            {!isAuthUser && (
                <section>
                    {needStaffLogout && (
                        <GatewayAndCTAs
                            isSessionOver={isSessionOver}
                            selfThemeBackColor={selfThemeBackColor}
                            selfThemeSColor={selfThemeSColor}
                            fullName={fullName}
                            bizCodeName={bizCodeName}
                            loadingAccess={loadingData}
                        />
                    )}
                    {conditionRegister}
                    {conditionLogin}
                </section>
            )}

            {isAuthUser && (
                <section>
                    {isCliUser && (
                        <ClientUserAppContent
                            businessId={businessId}
                            useProfile={useProfile}
                            useClientUser={useClientUser}
                            useClientAdmin={useClientAdmin}
                            needAppForCliAdmin={needAppForCliAdmin}
                            colorP={selfThemePColor}
                            colorS={selfThemeSColor}
                        />
                    )}

                    {isCliAdmin && !isSessionOver && showNotificationBell()}
                    {isCliAdmin && !isCliUser && (
                        <GatewayAndCTAs
                            isSessionOver={isSessionOver}
                            selfThemeBackColor={selfThemeBackColor}
                            selfThemeSColor={selfThemeSColor}
                            fullName={fullName}
                            bizCodeName={bizCodeName}
                            loadingAccess={loadingData}
                        />
                    )}
                    {!isAuthUser && isCliAdmin && showLogin()}
                </section>
            )}
            {!isAuthUser && versionReady && <AsyncVersion />}
        </div>
    );
}

export default withRouter(ClientMobileApp);

ClientMobileApp.whyDidYouRender = false;

/* COMMENTS
n1: LESSON: Do not use Fragment inside session since Fragment can hide inner elements...
*/

/* ARCHIVES
<div className="my-3">{showAccessSwitcher()}</div>

{isAuthUser && !name
? (
    <div style={{margin: '200px 0 0'}}>
        <LoadingThreeDots color="white" />
    </div>
)
 */

/*
<div className="my-3 container-center">
    <img src="/img/official-logo.jpg" alt="logo" width={300} height="auto"/>
</div>
 */
