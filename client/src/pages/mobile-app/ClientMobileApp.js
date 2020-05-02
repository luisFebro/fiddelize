// 75% of screen and 360 x 588 is the nearest screen size resolution of a common mobile
import React, { useRef, useEffect, useState } from 'react';
import Login from '../../components/auth/Login';
import { Link, withRouter } from 'react-router-dom';
import { useStoreDispatch } from 'easy-peasy';
import RadiusBtn from '../../components/buttons/RadiusBtn';
import {CLIENT_URL} from '../../config/clientUrl';
import lStorage, { needAppRegisterOp } from '../../utils/storage/lStorage';
import Register from '../../components/auth/Register';
import { useProfile, useClientAdmin, useClientUser } from '../../hooks/useRoleData';
import { logout } from '../../redux/actions/authActions';
import { updateUser, countField } from '../../redux/actions/userActions';
import { setRun } from '../../hooks/useRunComp';
import { useAuthUser } from '../../hooks/useAuthUser';
import { useAppSystem } from '../../hooks/useRoleData';
import { useRunComp } from '../../hooks/useRunComp';
import ClientUserAppContent from './content/ClientUserAppContent';
import imgLib, { ImgLoader } from '../../utils/storage/lForageStore';
// import LoadingThreeDots from '../../components/loadingIndicators/LoadingThreeDots';
// import ImageLogo from '../../components/ImageLogo';

const needAppRegister = lStorage("getItem", needAppRegisterOp);

const isSmall = window.Helper.isSmallScreen();

function ClientMobileApp({ location, history }) {
    const { isAuthUser } = useAuthUser();
    const { roleWhichDownloaded, businessId } = useAppSystem();

    const [loginOrRegister, setLoginOrRegister] = useState("login");

    const { _id, role, name } = useProfile();
    const { bizCodeName, selfBizLogoImg } = useClientAdmin();
    const { currScore } = useClientUser();
    const { runName } = useRunComp();

    const dispatch = useStoreDispatch();

    const searchQuery = location.search;
    const needAppForCliAdmin = searchQuery.includes("client-admin=1");

    useEffect(() => {
        countField(_id, { field: "clientUserData.totalVisits" })
    }, [_id])

    useEffect(() => {
        if(runName === "logout") {
            history.push("/mobile-app");
        }
    }, [runName])

    useEffect(() => {
        if(needAppForCliAdmin && !currScore) {
            const newCliUserData = {
                "clientUserData.bizId": businessId,
                "clientUserData.cashCurrScore": "0",
                "clientUserData.currScore": 0,
                "clientUserData.lastScore": "0",
                "clientUserData.totalGeneralScore": 0,
                "clientUserData.totalPurchasePrize": 0
            }
            updateUser(dispatch, newCliUserData, businessId);
        }
    }, [needAppForCliAdmin])

    useEffect(() => {
        if(needAppRegister) {
            setLoginOrRegister("register");
            lStorage("setItem", {...needAppRegisterOp, value: false})
        }
    }, [needAppRegister])

    const showLogo = () => {
        const logSrc = isAuthUser ? selfBizLogoImg : imgLib.app_fiddelize_logo;
        return(
            <ImgLoader
                id="app_fiddelize_logo"
                className="animated zoomIn slow shadow-elevation-white"
                src={logSrc}
                style={{position: 'relative', margin: '15px 0', left: isSmall ? '5px' : '20px'}}
                width={!selfBizLogoImg && 190}
                height={!selfBizLogoImg && 85}
            />
        );
    }

    const showLogin = () => (
        <div className="container-center">
            <Login setLoginOrRegister={setLoginOrRegister} />
        </div>
    );

    const showRegister = (needLoginBtn, needSetFunc) => (
        <Register
            setLoginOrRegister={setLoginOrRegister || true}
            needLoginBtn={needLoginBtn}
        />
    );

    const isClientUserLogged = isAuthUser && role === "cliente";

    const showAppType = () => (
        roleWhichDownloaded && !isClientUserLogged && !needAppForCliAdmin &&
        <div className="container-center">
            <div className="position-relative">
                <p style={{zIndex: 100, top: '20px', left: '150px'}}
                    className="text-center text-white position-absolute text-shadow"
                >
                    <span className="text-subtitle font-weight-bold">
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
                <div
                    style={{animationIterationCount: 3}}
                    className="animated rubberBand delay-5s"
                >
                    <img width={460} height={130} src={`${CLIENT_URL}/img/shapes/blob1.svg`} alt="tipo de app"/>
                </div>
            </div>
        </div>
    );

    const showConnectedStatus = () => (
        <div className="mt-5 container-center-col text-white text-normal text-center">
            <span>
                Conectado por
                <br/>
                <strong className="text-title animated bounce">{name}</strong><br />
            </span>
            <div className="container-center mt-4">
                <Link
                    className="mr-3"
                    to={`/${bizCodeName}/cliente-admin/painel-de-controle`}
                    onClick={() => setRun(dispatch, "goDash")}
                >
                    <RadiusBtn title="acessar"/>
                </Link>
                <span>
                    <RadiusBtn
                        title="sair"
                        backgroundColor="var(--mainRed)"
                        onClick={() => logout(dispatch)}
                    />
                </span>
            </div>
        </div>
    );

    const conditionRegister = loginOrRegister === "register" && showRegister(true)
    const conditionLogin = loginOrRegister === "login" && showLogin()

    let isCliAdminConnected = role === "cliente-admin" || roleWhichDownloaded === "cliente-admin";
    const isCliUserConnected = needAppForCliAdmin || role === "cliente" || roleWhichDownloaded === "cliente";
    if(needAppForCliAdmin) {
        isCliAdminConnected = false;
    }

    return (
        <div style={{overflowX: 'hidden'}}>
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
                        />
                    )}

                    {isCliAdminConnected && showConnectedStatus()}
                    {!isAuthUser && isCliAdminConnected && showLogin()}
                </section>
            )}
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