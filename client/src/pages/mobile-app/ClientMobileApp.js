// 75% of screen and 360 x 588 is the nearest screen size resolution of a common mobile
import React, { useRef, useEffect, useState } from 'react';
import AsyncLogin from '../../components/auth/AsyncLogin';
import { Link, withRouter } from 'react-router-dom';
import { useStoreDispatch } from 'easy-peasy';
import RadiusBtn from '../../components/buttons/RadiusBtn';
import {CLIENT_URL} from '../../config/clientUrl';
import lStorage, { needAppRegisterOp } from '../../utils/storage/lStorage';
import AsyncRegisterCliUser from '../../components/auth/AsyncRegisterCliUser';
import { useProfile, useClientAdmin, useClientUser } from '../../hooks/useRoleData';
import { logout } from '../../redux/actions/authActions';
import { updateUser, countField } from '../../redux/actions/userActions';
import { setRun } from '../../hooks/useRunComp';
import { useAuthUser } from '../../hooks/useAuthUser';
import { useAppSystem } from '../../hooks/useRoleData';
import { useRunComp } from '../../hooks/useRunComp';
import ClientUserAppContent from './content/ClientUserAppContent';
import imgLib, { ImgLoader } from '../../utils/storage/lForageStore';
import selectTxtStyle from '../../utils/biz/selectTxtStyle';
import isThisApp from '../../utils/window/isThisApp';
import BadaloBell from '../../components/buttons/bells/badalo/BadaloBell';
// import LoadingThreeDots from '../../components/loadingIndicators/LoadingThreeDots';
// import ImageLogo from '../../components/ImageLogo';
import AsyncVersion from '../../_main-app/user-interfaces/version/AsyncVersion';
import useDelay from '../../hooks/useDelay';
import useCount from '../../hooks/useCount';
import CompLoader from '../../components/CompLoader';
import useBackColor from '../../hooks/useBackColor';

const needAppRegister = lStorage("getItem", needAppRegisterOp);

const isSmall = window.Helper.isSmallScreen();
const isApp = isThisApp();

function ClientMobileApp({ location, history }) {
    const [loginOrRegister, setLoginOrRegister] = useState("login");

    const { isAuthUser } = useAuthUser();
    const { roleWhichDownloaded, businessId } = useAppSystem();
    const { _id, role, name } = useProfile();
    const {
        bizCodeName,
        selfBizLogoImg,
        selfThemePColor,
        selfThemeSColor,
        selfThemeBackColor, } = useClientAdmin();
    const { currScore } = useClientUser();

    const { runName } = useRunComp();
    const versionReady = useDelay(2000);
    useCount("ClientMobileApp.js"); // RT= 72 after login cli-use
    useBackColor(`var(--themeBackground--${selfThemeBackColor})`);
    const dispatch = useStoreDispatch();

    const searchQuery = location.search;
    const needAppForCliAdmin = searchQuery.includes("client-admin=1");

    useEffect(() => {
        if(role === "cliente") {
            countField(_id, { field: "clientUserData.totalVisits" })
        }
    }, [_id, role])

    useEffect(() => {
        if(runName === "logout") {
            history.push("/mobile-app");
        }
    }, [runName])

    useEffect(() => {
        if(needAppRegister) {
            setLoginOrRegister("register");
            lStorage("setItem", {...needAppRegisterOp, value: false})
        }
    }, [needAppRegister])

    const needClientLogo = (isApp && selfBizLogoImg) || (isAuthUser && selfBizLogoImg);
    const handleLogoSrc = () => {
        if(needClientLogo) {
            return imgLib.app_biz_logo(selfBizLogoImg);
        } else {
            return imgLib.app_fiddelize_logo;
        }
    }
    useEffect(() => {
        handleLogoSrc();
    }, [])

    const showLogo = () => {
        const isSquared = isApp && selfBizLogoImg && selfBizLogoImg.includes("h_100,w_100");

        return(
            <div className="container-center">
                <ImgLoader
                    className={`${needClientLogo ? "app_biz_logo" : "app_fiddelize_logo"} animated zoomIn slow`}
                    style={{position: 'relative', margin: '15px 0'}}
                    width={isSquared ? 100 : 190}
                    height={isSquared ? 100 : 85}
                />
            </div>
        );
    }

    const showLogin = () => (
        <CompLoader
            width={200}
            height={300}
            comp={
                <div
                    className="container-center position-relative"
                    style={{top: -78}}
                >
                    <AsyncLogin setLoginOrRegister={setLoginOrRegister} />
                </div>
            }
        />
    );

    const showRegister = (needLoginBtn, needSetFunc) => (
        <CompLoader
            width={200}
            height={300}
            comp={
                <div className="position-relative" style={{top: -120}}>
                    <AsyncRegisterCliUser
                        setLoginOrRegister={setLoginOrRegister || true}
                        needLoginBtn={needLoginBtn}
                    />
                </div>
            }
        />
    );

    const isClientUserLogged = role === "cliente"; // isAuthUser && this isAuthUser hinters app type to appear when user is logged out.
    const shapeColor = `app_start_shape_${selfThemePColor}`;
    const showAppType = () => (
        roleWhichDownloaded && !isClientUserLogged && !needAppForCliAdmin &&
        <div className="container-center">
            <div className="position-relative" style={{top: -55, marginTop: 90, marginBottom: 40}}>
                <div
                    style={{animationIterationCount: 1}}
                    className="animated rubberBand delay-5s"
                >
                    <ImgLoader
                        className={shapeColor}
                        src={imgLib[shapeColor]}
                        width={460}
                        needLoader={false}
                        height={130}
                        alt="tipo de app"
                    />
                </div>
                <p
                    style={{zIndex: 100, top: '25px', left: '50%', transform: 'translateX(-50%)'}}
                    className="text-center text-white position-absolute text-shadow"
                >
                    <span
                        className="position-relative text-subtitle font-weight-bold"
                        style={{left: -25}}
                    >
                        App
                    </span>
                    <br />
                    <span
                        className="text-title text-nowrap"
                    >
                        do {
                            roleWhichDownloaded === "cliente"
                            ? "Cliente" : "Admin"
                        }
                    </span>
                </p>
            </div>
        </div>
    );

    const showNotificationBell = () => (
        <div className="container-center">
            <BadaloBell
                position="relative"
                top={-60}
                left={0}
                notifBorderColor={"var(--themeBackground--" + selfThemeBackColor + ")"}
                notifBackColor={selfThemeBackColor === "red" ? "var(--themePLight--black)" : "var(--expenseRed)"}
                badgeValue={1}
            />
        </div>
    );

    const handleConnectedStatusClick = () => {
        setRun(dispatch, "goDash");
    }

    const handleLogout = () => {
        logout(dispatch);
    }

    const showConnectedStatus = () => (
        <div
            className="position-relative my-5 container-center-col text-white text-normal text-center"
            style={{top: -68}}
        >
            <span className={`${selectTxtStyle(selfThemeBackColor)} font-weight-bold`}>
                Conectado por
                <br/>
                <strong className="text-title animated bounce">{name ? name : "..."}</strong><br />
            </span>
            <div className="container-center mt-4">
                <Link
                    className="mr-3 no-text-decoration"
                    to={`/${bizCodeName}/cliente-admin/painel-de-controle`}
                    onClick={handleConnectedStatusClick}
                >
                    <RadiusBtn
                        title="acessar"
                        backgroundColor={'var(--themeSDark--' + selfThemeSColor + ')'}
                    />
                </Link>
                <span>
                    <RadiusBtn
                        title="sair"
                        backgroundColor="var(--mainRed)"
                        onClick={handleLogout}
                    />
                </span>
            </div>
        </div>
    );

    const conditionRegister = loginOrRegister === "register" && showRegister(true)
    const conditionLogin = loginOrRegister === "login" && showLogin()

    let isCliAdminConnected = role === "cliente-admin" || roleWhichDownloaded === "cliente-admin";
    console.log("role", role);
    console.log("roleWhichDownloaded", roleWhichDownloaded);
    console.log("needAppForCliAdmin", needAppForCliAdmin);
    const isCliUserConnected = needAppForCliAdmin || role === "cliente" || roleWhichDownloaded === "cliente";
    if(needAppForCliAdmin) {
        isCliAdminConnected = false;
    }

    return (
        <div
            style={{overflowX: 'hidden'}}
            className={`theme-back--${selfThemeBackColor}`}
        >
            <span className="text-right text-white for-version-test">{""}</span>
            {showLogo()}
            {showAppType()}

            {!isAuthUser && (
                <section>
                    {conditionRegister}
                    {conditionLogin}
                </section>
            )}

            {isAuthUser && (
                <section>
                    {isCliUserConnected && (
                        <ClientUserAppContent
                            useProfile={useProfile}
                            useClientUser={useClientUser}
                            useClientAdmin={useClientAdmin}
                            needAppForCliAdmin={needAppForCliAdmin}
                            colorP={selfThemePColor}
                            colorS={selfThemeSColor}
                        />
                    )}

                    {isCliAdminConnected && showNotificationBell()}
                    {isCliAdminConnected && showConnectedStatus()}
                    {!isAuthUser && isCliAdminConnected && showLogin()}
                </section>
            )}
            {!isAuthUser && versionReady && <AsyncVersion />}
        </div>
    );
}

export default withRouter(ClientMobileApp);

/* COMMENTS
n1: LESSON: Do not use Fragment inside session since Fragment can hide inner elements...
*/

/* ARCHIVES
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