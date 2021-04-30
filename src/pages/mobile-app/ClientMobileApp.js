// 75% of screen and 360 x 588 is the nearest screen size resolution of a common mobile
import { useEffect, useState, Fragment } from "react";
import { withRouter } from "react-router-dom";
import Card from "@material-ui/core/Card";
import AsyncLogin from "components/auth/AsyncLogin";
import { useBizData } from "init";
import { useProfile } from "init";
import { useAppSystem } from "hooks/useRoleData";
import { useAuthUser } from "hooks/useAuthUser";

import { useRunComp } from "hooks/useRunComp";
import isThisApp from "utils/window/isThisApp";
import AsyncBellNotifBtn from "components/notification/AsyncBellNotifBtn";
import useDelay from "hooks/useDelay";
import CompLoader from "components/CompLoader";
import useBackColor from "hooks/useBackColor";
import useData from "hooks/useData";
import useScrollUp from "hooks/scroll/useScrollUp";
import { Load } from "components/code-splitting/LoadableComp";
import removeImgFormat from "utils/biz/removeImgFormat";
import GatewayAndCTAs from "./start-comps/GatewayAndCTAs";
import AppTypeBubble from "./start-comps/AppTypeBubble";
import useLoginOrRegister from "./helpers/useLoginOrRegister";
import AsyncVersion from "../../_main-app/user-interfaces/version/AsyncVersion";
import ClientUserAppContent from "./content/ClientUserAppContent";

const AsyncAdminQuickActions = Load({
    loading: false,
    loader: () =>
        import(
            "./AdminQuickActions" /* webpackChunkName: "admin-quick-actions-comp-lazy" */
        ),
});

const AsyncPWA = Load({
    loading: true,
    loader: () =>
        import(
            "../../components/pwa-installer/PwaInstaller" /* webpackChunkName: "pwa-comp-lazy" */
        ),
});

const AsyncRegisterCliUser = Load({
    loading: true,
    loader: () =>
        import(
            "../../components/auth/AsyncRegisterCliUser" /* webpackChunkName: "cli-user-register-comp-lazy" */
        ),
});

const AsyncRegisterCliMember = Load({
    loading: true,
    loader: () =>
        import(
            "../../components/auth/AsyncRegisterCliMember" /* webpackChunkName: "cli-member-register-comp-lazy" */
        ),
});
// import AccessSwitcher from "../../components/auth/password/AccessSwitcher";
const AsyncRegisterBizTeam = Load({
    loading: true,
    loader: () =>
        import(
            "../../components/auth/AsyncRegisterBizTeam" /* webpackChunkName: "biz-team-register-comp-lazy" */
        ),
});

// const isSmall = window.Helper.isSmallScreen();
const isApp = isThisApp();

function ClientMobileApp({ location, history }) {
    const [loginOrRegister, setLoginOrRegister] = useState("login");

    useScrollUp();

    const [
        userId,
        role,
        rememberAccess,
        success,
        fullName,
        disconnectCliMember,
        disconnectAgent,
        isInstantApp,
        instantBizImg,
        instantBizName,
        needAppRegister,
    ] = useData([
        "userId",
        "role",
        "rememberAccess",
        "success",
        "name",
        "disconnectCliMember",
        "disconnectAgent",
        "isInstantApp",
        "instantBizImg",
        "instantBizName",
        "needAppRegister",
    ]);

    const loadingData = Boolean(userId === "...");

    const { notifCount } = useProfile();

    useLoginOrRegister({
        setLoginOrRegister,
        needAppRegister,
        role,
        isInstantApp,
    });

    let { isAuthUser } = useAuthUser();
    isAuthUser = isAuthUser || (success !== "..." && success);

    const { roleWhichDownloaded, businessId } = useAppSystem();

    // MAIN VARIABLES
    // # query
    const searchQuery = location.search;
    const needAppForCliAdmin = searchQuery.includes("client-admin=1");
    const isUrlAdmin = searchQuery.indexOf("abrir=1&admin=1") !== -1;
    const needPWA = searchQuery.includes("banner=1"); // used for trying to show the download banner again if the first attempt has failed
    // # roles
    const isStaff = role === "cliente-membro" || role === "cliente-admin";
    const isBizTeam =
        role === "nucleo-equipe" || roleWhichDownloaded === "nucleo-equipe";
    let isCliAdmin =
        role === "cliente-admin" || roleWhichDownloaded === "cliente-admin";
    const isCliMember =
        role === "cliente-membro" || roleWhichDownloaded === "cliente-membro";
    let isCliUser = role === "cliente" || roleWhichDownloaded === "cliente";

    // # auth
    const isSessionOver = !success || !localStorage.getItem("token");
    const needStaffLogout = isStaff && isSessionOver && rememberAccess;

    if (needAppForCliAdmin) {
        isCliAdmin = false;
        isCliUser = true;
    }
    const accessCheck = !isStaff || (!loadingData && !rememberAccess);
    // END MAIN VARIABLES

    const {
        bizCodeName,
        selfBizLogoImg,
        selfThemePColor,
        selfThemeSColor,
        selfThemeBackColor,
    } = useBizData();

    const { runName } = useRunComp();
    const versionReady = useDelay(2000);

    // useCount("ClientMobileApp.js"); // RT= 72 after login cli-use
    useBackColor(
        `var(--themeBackground--${isBizTeam ? "default" : selfThemeBackColor})`
    );

    useEffect(() => {
        if (runName === "logout") {
            history.push("/mobile-app");
        }
    }, [runName]);

    if (isCliMember) {
        // this var is removed when making login
        // userId to check if data still persists or user device
        // otherwise the user will be not able to access...
        // Always check if the data is still available on indexedDB, if not show login comp for users.
        if (!disconnectCliMember && userId) {
            isSessionOver
                ? history.push("/senha-equipe")
                : history.push("/t/app/equipe");
        }
    }

    if (isBizTeam) {
        if (!disconnectAgent && userId) {
            isSessionOver
                ? history.push("t/app/nucleo-equipe/acesso")
                : history.push("t/app/nucleo-equipe");
        }
    }

    const needClientLogo =
        (isApp && selfBizLogoImg) || (isAuthUser && selfBizLogoImg);

    const { newImg: thisSelfBizLogoImg, width, height } = removeImgFormat(
        selfBizLogoImg
    );
    const logoSrc =
        isBizTeam || !needClientLogo
            ? "/img/official-logo-name.png"
            : thisSelfBizLogoImg;

    const showLogo = () => {
        return (
            <div className="container-center">
                <img
                    src={logoSrc}
                    className="animated fadeInUp slow delay-2s"
                    style={{ position: "relative", margin: "15px 0" }}
                    width={width}
                    height={height}
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
                        style={{ top: 10 }}
                    >
                        <AsyncLogin
                            setLoginOrRegister={setLoginOrRegister}
                            needAppRegister={needAppRegister}
                            isBizTeam={isBizTeam}
                            rootClassname=""
                        />
                    </div>
                }
            />
        </Fragment>
    );

    const showRegister = () => (
        <Fragment>
            <p
                className="mx-2 mt-3 text-normal font-weight-bold text-center text-white"
                style={{ marginBottom: 100 }}
            >
                {isCliUser && // in near updates - rewards or discounts according to which games cli-admin has chosen
                    "Acumule pontos. Supere Desafios. Ganhe prêmios no jogo de compras feito para você!"}
                {isCliMember &&
                    "Adicione pontos e clientes para o clube de fidelidade em segundos."}
                {isBizTeam &&
                    "Faça parte do time da Fiddelize e comece a ganhar dinheiro."}
            </p>
            <CompLoader
                width={200}
                height={300}
                comp={
                    <div className="position-relative" style={{ top: -120 }}>
                        {isCliUser && (
                            <AsyncRegisterCliUser
                                setLoginOrRegister={setLoginOrRegister}
                            />
                        )}
                        {isCliMember && (
                            <AsyncRegisterCliMember
                                setLoginOrRegister={setLoginOrRegister}
                            />
                        )}
                        {isBizTeam && (
                            <AsyncRegisterBizTeam
                                setLoginOrRegister={setLoginOrRegister}
                            />
                        )}
                    </div>
                }
            />
        </Fragment>
    );

    const showNotificationBell = () => (
        <div className="container-center">
            <AsyncBellNotifBtn
                position="relative"
                top={15}
                left={0}
                notifBorderColor={`var(--themeBackground--${selfThemeBackColor})`}
                notifBackColor={
                    selfThemeBackColor === "red"
                        ? "var(--themePLight--black)"
                        : "var(--expenseRed)"
                }
                badgeValue={notifCount}
            />
        </div>
    );

    const conditionRegister = loginOrRegister === "register" && showRegister();
    const conditionLogin =
        (loginOrRegister === "login" && accessCheck && showLogin()) ||
        (loginOrRegister === "login" && !isAuthUser);

    if (loadingData) {
        return (
            <p className="text-subtitle font-weight-bold full-page text-center text-white">
                Carregando...
            </p>
        );
    }

    const isFiddelizeLogo = instantBizImg === "/img/official-logo-name.png";
    return (
        <div style={{ overflowX: "hidden" }}>
            <span className="text-right text-white for-version-test" />
            {isInstantApp && !isAuthUser ? (
                <section className="container-center mx-3 text-normal">
                    <Card
                        className="animated fadeInUp slow"
                        style={{
                            backgroundColor: "var(--mainWhite)",
                            borderRadius: "0 0 50px 50px",
                        }}
                    >
                        <div className="animated fadeInDown delay-3s container-center">
                            <img
                                style={{
                                    padding: "5px",
                                    backgroundColor: isFiddelizeLogo
                                        ? "var(--themeP)"
                                        : undefined,
                                    maxWidth: "170px",
                                }}
                                className="shadow-babadoo"
                                src={instantBizImg}
                                alt={instantBizName}
                            />
                        </div>
                        <p className="animated fadeInDown delay-4s mx-3 text-purple font-weight-bold text-center my-3">
                            Novo App de {instantBizName} foi instalado na sua
                            conta.
                        </p>
                    </Card>
                </section>
            ) : (
                <Fragment>
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
                </Fragment>
            )}

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
                            loadingData={loadingData}
                            useProfile={useProfile}
                            useBizData={useBizData}
                            needAppForCliAdmin={needAppForCliAdmin}
                            colorP={selfThemePColor}
                            colorS={selfThemeSColor}
                            totalNotifications={notifCount}
                        />
                    )}

                    {isCliAdmin && !isSessionOver && showNotificationBell()}
                    {isCliAdmin && !isCliUser && (
                        <Fragment>
                            <GatewayAndCTAs
                                isSessionOver={isSessionOver}
                                selfThemeBackColor={selfThemeBackColor}
                                selfThemeSColor={selfThemeSColor}
                                fullName={fullName}
                                bizCodeName={bizCodeName}
                                loadingAccess={loadingData}
                            />
                            <AsyncAdminQuickActions
                                playBeep={undefined}
                                showMoreBtn={!isSessionOver}
                                colorS={selfThemeSColor}
                            />
                        </Fragment>
                    )}
                    {!isAuthUser && isCliAdmin && showLogin()}
                </section>
            )}
            {!isAuthUser && versionReady && <AsyncVersion />}
            {needPWA && (
                <AsyncPWA
                    title="Baixe aqui nosso app"
                    icon="/img/official-logo-white.png"
                    alwaysOn
                />
            )}
        </div>
    );
}

export default withRouter(ClientMobileApp);

/* COMMENTS
n1: LESSON: Do not use Fragment inside session since Fragment can hide inner elements...
*/

/* ARCHIVES
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

const handleLogoSrc = () => {
    if (needClientLogo) {
        const { newImg: thisSelfBizLogoImg } = removeImgFormat(
            selfBizLogoImg
        );
        return setUrl({ ...url, logoBiz: thisSelfBizLogoImg });
    }
    return setUrl({ ...url, logoFid: "/img/official-logo-name.png" });
};
useEffect(() => {
    handleLogoSrc();
}, [selfBizLogoImg]);

*/
