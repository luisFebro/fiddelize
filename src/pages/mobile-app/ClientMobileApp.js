// 75% of screen and 360 x 588 is the nearest screen size resolution of a common mobile
import { useState, Fragment } from "react";
import { withRouter } from "react-router-dom";
import Card from "@material-ui/core/Card";
import AsyncLogin from "components/auth/AsyncLogin";
import useData, { useBizData } from "init";
import useAuth from "auth/useAuth";
import isThisApp from "utils/window/isThisApp";
import AsyncBellNotifBtn from "components/notification/AsyncBellNotifBtn";
import useDelay from "hooks/useDelay";
import CompLoader from "components/CompLoader";
import useBackColor from "hooks/useBackColor";
import useScrollUp from "hooks/scroll/useScrollUp";
import { Load } from "components/code-splitting/LoadableComp";
import removeImgFormat from "utils/biz/removeImgFormat";
import AppTypeBubble from "./start-comps/AppTypeBubble";
import useLoginOrRegister from "./helpers/useLoginOrRegister";
import AsyncVersion from "../../_main/user-interfaces/version/AsyncVersion";
// import ClientUserAppContent from "./content/ClientUserAppContent";

const AsyncGatewayAndCTAs = Load({
    loading: false,
    loader: () =>
        import(
            "./start-comps/GatewayAndCTAs" /* webpackChunkName: "gateway-and-cts-comp-lazy" */
        ),
});

const AsyncClientUserAppContent = Load({
    loading: true,
    loader: () =>
        import(
            "./content/ClientUserAppContent" /* webpackChunkName: "client-user-app-content-comp-lazy" */
        ),
});

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

const AsyncDownloadAppGuide = Load({
    loading: true,
    loader: () =>
        import(
            "./DownloadAppGuide" /* webpackChunkName: "download-app-guide-comp-lazy" */
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
    // the needAppRegister is only updated after reloading, and the register button should not appear right after a successful register. This cond will solve that without having to reload the variable
    const [successfulRegister, setSuccessfulRegister] = useState(false);

    useScrollUp();

    const [
        role,
        userId,
        rememberAccess,
        fullName,
        disconnectCliMember,
        disconnectAgent,
        isInstantApp,
        instantBizImg,
        instantBizName,
        needAppRegister,
        loadingData,
    ] = useData([
        "role",
        "userId",
        "rememberAccess",
        "name",
        "disconnectCliMember",
        "disconnectAgent",
        "isInstantApp",
        "instantBizImg",
        "instantBizName",
        "needAppRegister",
    ]);

    const [bizName] = useData(["bizName"], "user");

    const {
        bizId,
        bizLinkName,
        bizLogo,
        themePColor,
        themeSColor,
        themeBackColor,
    } = useBizData();

    const { notifCount } = useData();

    useLoginOrRegister({
        setLoginOrRegister,
        needAppRegister,
        role,
        isInstantApp,
    });

    const isAuthUser = useAuth();

    // MAIN VARIABLES
    // # query
    const searchQuery = location.search;
    // used for trying to show the download banner again if the first attempt in the download page has failed
    const isPwaBoard = searchQuery.includes("placa=1");
    const needAppForCliAdmin = searchQuery.includes("client-admin=1");
    const isUrlAdmin = searchQuery.indexOf("admin=1") !== -1;
    // # roles
    const isStaff = role === "cliente-membro" || role === "cliente-admin";
    const isBizTeam = role === "nucleo-equipe";
    let isCliAdmin = role === "cliente-admin";
    const isCliMember = role === "cliente-membro";
    let isCliUser = role === "cliente";

    const isSessionOver = !isAuthUser;
    const needAdminLogout = isSessionOver && rememberAccess && isCliAdmin;

    if (needAppForCliAdmin) {
        isCliAdmin = false;
        isCliUser = true;
    }

    const accessCheck = !isStaff && !loadingData && !rememberAccess; //
    // END MAIN VARIABLES

    const versionReady = useDelay(2000);

    // useCount("ClientMobileApp.js"); // RT= 72 after login cli-use
    useBackColor(
        `var(--themeBackground--${isBizTeam ? "default" : themeBackColor})`
    );

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

    const needClientLogo = (isApp && bizLogo) || (isAuthUser && bizLogo);

    const { newImg: thisbizLogo, width, height } = removeImgFormat(bizLogo);
    const logoSrc =
        isBizTeam || !needClientLogo
            ? "/img/official-logo-name.png"
            : thisbizLogo;

    const showLogo = () => (
        <div className="container-center">
            <img
                src={logoSrc}
                className="animated fadeInUp slow delay-2s"
                style={{ position: "relative", margin: "15px 0" }}
                width={width}
                height={height}
                alt="logo"
            />
        </div>
    );

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
                            needAppRegister={
                                successfulRegister ? false : needAppRegister
                            }
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
                    "Acumule pontos. Supere Metas. Ganhe benefícios em jogos de compra feito para você!"}
                {isCliMember &&
                    "Adicione pontos e clientes para o clube de compras em segundos."}
                {isBizTeam &&
                    "Faça parte do time da Fiddelize e comece a ganhar dinheiro."}
            </p>
            <CompLoader
                width={200}
                height={300}
                comp={
                    <div className="position-relative" style={{ top: -80 }}>
                        {isCliUser && (
                            <AsyncRegisterCliUser
                                needAlreadyRegisterBtn
                                setSuccessfulRegister={setSuccessfulRegister}
                                setLoginOrRegister={setLoginOrRegister}
                            />
                        )}
                        {isCliMember && (
                            <AsyncRegisterCliMember
                                setSuccessfulRegister={setSuccessfulRegister}
                                setLoginOrRegister={setLoginOrRegister}
                            />
                        )}
                        {isBizTeam && (
                            <AsyncRegisterBizTeam
                                setSuccessfulRegister={setSuccessfulRegister}
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
                notifBorderColor={`var(--themeBackground--${themeBackColor})`}
                notifBackColor={
                    themeBackColor === "red"
                        ? "var(--themePLight--black)"
                        : "var(--expenseRed)"
                }
                badgeValue={notifCount}
            />
        </div>
    );

    const conditionRegister = loginOrRegister === "register";
    const conditionLogin =
        (loginOrRegister === "login" && accessCheck) ||
        (loginOrRegister === "login" && !isAuthUser && !needAdminLogout);

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
                        isUrlAdmin={isUrlAdmin}
                        needAppForCliAdmin={needAppForCliAdmin}
                        themePColor={themePColor}
                        isAuthUser={isAuthUser}
                    />
                </Fragment>
            )}

            {!isAuthUser && (
                <section>
                    {needAdminLogout && (
                        <AsyncGatewayAndCTAs
                            isSessionOver={isSessionOver}
                            themeBackColor={themeBackColor}
                            themeSColor={themeSColor}
                            fullName={fullName}
                            bizLinkName={bizLinkName}
                            loadingAccess={loadingData}
                        />
                    )}
                    {conditionRegister && showRegister()}
                    {conditionLogin && showLogin()}
                </section>
            )}

            {isPwaBoard && conditionRegister && (
                <AsyncDownloadAppGuide bizName={bizName} />
            )}

            {isAuthUser && (
                <section>
                    {isCliUser && (
                        <AsyncClientUserAppContent
                            businessId={bizId}
                            loadingData={loadingData}
                            useThisData={useData}
                            useBizData={useBizData}
                            needAppForCliAdmin={needAppForCliAdmin}
                            colorP={themePColor}
                            colorS={themeSColor}
                            totalNotifications={notifCount}
                        />
                    )}

                    {isCliAdmin && !isSessionOver && showNotificationBell()}
                    {isCliAdmin && !isCliUser && (
                        <Fragment>
                            <AsyncGatewayAndCTAs
                                isSessionOver={isSessionOver}
                                themeBackColor={themeBackColor}
                                themeSColor={themeSColor}
                                fullName={fullName}
                                bizLinkName={bizLinkName}
                                loadingAccess={loadingData}
                            />
                            <AsyncAdminQuickActions
                                playBeep={undefined}
                                showMoreBtn={!isSessionOver}
                                colorS={themeSColor}
                            />
                        </Fragment>
                    )}
                    {!isAuthUser && isCliAdmin && showLogin()}
                </section>
            )}
            {!isAuthUser && versionReady && <AsyncVersion />}
            {isPwaBoard && (
                <AsyncPWA
                    title="Baixe aqui o seu app"
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
        const { newImg: thisbizLogo } = removeImgFormat(
            bizLogo
        );
        return setUrl({ ...url, logoBiz: thisbizLogo });
    }
    return setUrl({ ...url, logoFid: "/img/official-logo-name.png" });
};
useEffect(() => {
    handleLogoSrc();
}, [bizLogo]);

*/
