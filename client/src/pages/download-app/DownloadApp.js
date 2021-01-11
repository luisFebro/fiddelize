import React, { useState, useEffect, Fragment } from "react";
import ScrollArrow from "../../keyframes/built/scroll-arrow/ScrollArrow";
import parse from "html-react-parser";
import PwaInstaller from "../../components/pwa-installer/PwaInstaller";
import { CLIENT_URL } from "../../config/clientUrl";
import checkIfElemIsVisible from "../../utils/window/checkIfElemIsVisible";
import { useClientAdmin } from "../../hooks/useRoleData";
import { readClientAdmin } from "../../redux/actions/userActions";
import { showSnackbar } from "../../redux/actions/snackbarActions";
import lStorage from "../../utils/storage/lStorage";
import { useStoreDispatch } from "easy-peasy";
import Spinner from "../../components/loadingIndicators/Spinner";
import useElemShowOnScroll from "../../hooks/scroll/useElemShowOnScroll";
import useAnimateElem from "../../hooks/scroll/useAnimateElem";
import useBackColor from "../../hooks/useBackColor";
import selectTxtStyle from "../../utils/biz/selectTxtStyle";
import getQueries from "./helpers/getQueries";
import { handleRoleStorage } from "./helpers";
import useAllowedLink from "./hooks/useAllowedLink";
import { Load } from "../../components/code-splitting/LoadableComp";
import ButtonFab from "../../components/buttons/material-ui/ButtonFab";

export const AsyncDetectedApp = Load({
    loader: () =>
        import(
            "./detected-app/DetectedApp" /* webpackChunkName: "detected-app-comp-lazy" */
        ),
});
// CONTENTS
export const AsyncBizTeamText = Load({
    loader: () =>
        import(
            "./app-type-texts/BizTeamText" /* webpackChunkName: "main-content-download-page-lazy" */
        ),
});
export const AsyncClientMemberText = Load({
    loader: () =>
        import(
            "./app-type-texts/ClientMemberText" /* webpackChunkName: "main-content-download-page-lazy" */
        ),
});
export const AsyncClientAdminText = Load({
    loader: () =>
        import(
            "./app-type-texts/ClientAdminText" /* webpackChunkName: "main-content-download-page-lazy" */
        ),
});
export const AsyncClientUserText = Load({
    loader: () =>
        import(
            "./app-type-texts/ClientUserText" /* webpackChunkName: "main-content-download-page-lazy" */
        ),
});
// END CONTENTS

const isSmall = window.Helper.isSmallScreen();

const iconStyle = {
    fontSize: "140px",
    color: "var(--mainWhite)",
    filter: "drop-shadow(.5px .5px 1.5px black)",
};

const getStyles = ({ isCliAdmin, pColor }) => ({
    icon: {
        fontSize: isCliAdmin ? "6rem" : "3rem",
        fontWeight: "bold",
    },
    margin: {
        marginTop: "110px",
    },
    hightlighedName: {
        padding: "5px 20px",
        borderRadius: "45px",
        background: `var(--themePLight--${
            pColor === "undefined" ? "default" : pColor
        })`,
    },
});

// Valid links:
// general: site/baixe-app?negocio=${bizName}&id=${bizId}&cliente=1
// custom name: site/baixe-app/${name}?negocio=${bizName}&id=${bizId}&cliente=1

export default function DownloadApp({ match, location }) {
    const [isPageReady, setPageReady] = useState(false);
    const [data, setData] = useState({
        run: false,
        downloadAvailable: false, // LESSON: false is default
        analysis: true,
        showDesktopMsg: false,
        needSelfServiceData: false,
        // for test only
        testMode: true,
        appinstalled: "none",
        relatedInstalledApps: "none",
        beforeinstallprompt: "none",
    });

    const {
        run,
        downloadAvailable,
        analysis,
        showDesktopMsg,
        needSelfServiceData,
        testMode,
        appinstalled,
        relatedInstalledApps,
        beforeinstallprompt,
    } = data;

    const matchName = match.params.userName;
    const userName = matchName && matchName.replace(/\+/g, " ").cap();

    // MAIN VARIABLES
    const [
        bizName,
        bizId,
        bizLogo,
        backColor,
        pColor,
        userScore,
        memberJob,
        linkId,
        // roles
        isBizTeam,
        isCliAdmin,
        isCliMember,
        isCliUser,
        isFromAdminPanel,
        // others
        isValidRoleType,
        isLinkInvalid,
        whichRole,
        primaryAgent,
    ] = getQueries({
        location,
    });
    // END MAIN VARIABLES

    // STYLES
    const styles = getStyles({ isCliAdmin, pColor });
    const txtPColor = selectTxtStyle(pColor);
    const txtBackColor = selectTxtStyle(backColor);
    // END STYLES

    // HOOKS
    const isAllowedLink = useAllowedLink({ bizId, isCliUser, userScore });
    useEffect(() => {
        checkIfElemIsVisible(".target-download", (res) =>
            setData((prev) => ({ ...prev, run: true }))
        );
        if (run) {
            setTimeout(
                () => setData((prev) => ({ ...prev, analysis: false })),
                5000
            );
        }
    }, [run]);

    useEffect(() => {
        setTimeout(() => setPageReady(true), 2000);
    }, []);

    useAnimateElem(".download-app--txt", {
        animaIn: "fadeInUp",
        speed: "normal",
    });

    useBackColor(
        `var(--themeBackground--${
            backColor === "undefined" ? "default" : backColor
        })`
    );
    const dispatch = useStoreDispatch();
    // END HOOKS

    // STORAGE
    isAllowedLink &&
        handleRoleStorage({
            userScore,
            whichRole,
            bizId,
            memberId: linkId,
            memberJob,
            primaryAgent,
        });
    // admin app config
    const {
        selfBizLogoImg,
        selfMilestoneIcon,
        selfThemePColor,
        selfThemeSColor,
        selfThemeBackColor,
    } = useClientAdmin();

    useEffect(() => {
        readClientAdmin(dispatch, bizId).then((res) => {
            if (res.status !== 200)
                return showSnackbar(
                    dispatch,
                    "Ocorreu um problema. Verifique sua conexão",
                    "error"
                );
            setData({ ...data, needSelfServiceData: true });
        });
    }, [bizId]);

    if (needSelfServiceData) {
        const clientAdminData = {
            selfBizLogoImg,
            selfMilestoneIcon,
            selfThemePColor,
            selfThemeSColor,
            selfThemeBackColor,
        };
        const clientAdminColl = {
            collection: "clientAdmin",
            newObj: clientAdminData,
        };
        lStorage("setItems", clientAdminColl);
    }
    // end admin app config
    // END STORAGE

    const showSpinner = () =>
        !isPageReady && <Spinner marginY={600} size="large" logo="white" />;

    const showMainScrollArray = () => (
        <div
            className="margin-auto-90"
            style={{
                display: downloadAvailable ? "block" : "none",
                margin: "0 0 300px",
            }}
        >
            <ScrollArrow margin={30} />
            <div className="target-download">
                <ScrollArrow margin={5} />
            </div>
        </div>
    );

    const errorMsg = () => (
        <div className="text-white text-center">
            <p className={`pl-3 mt-5 text-center text-hero`}>
                Oops! Parece que esse link não é válido ou já usado.
            </p>
            <p
                className={`${
                    isSmall ? "ml-2 text-left" : "text-center"
                } my-5 text-title`}
            >
                Por favor, tente um outro link para baixar seu app.
            </p>
            {/*FUTURE UPDATE*/}
            <div style={{ display: "none" }}>
                A button which will take the user to a choose the company's page
                in order to get the right link again...
            </div>
        </div>
    );

    const showAlreadyDownloadedApp = () => {
        const instantAccountPayload = {
            role: whichRole,
            bizImg: isBizTeam ? "/img/official-logo-name.png" : bizLogo,
            bizName: isBizTeam ? "fiddelize" : bizName,
            // for specific user data
            isCliAdmin,
            isCliUser,
            bizId,
            primaryAgent,
            // cli-user
            memberJob,
            memberId: linkId,
            userScore,
        };

        return (
            <AsyncDetectedApp
                downloadAvailable={downloadAvailable}
                run={run}
                analysis={analysis}
                bizName={bizName}
                txtPColor={txtPColor}
                pColor={pColor}
                instantAccountPayload={instantAccountPayload}
                setData={setData}
            />
        );
    };

    const handleAppTypeText = () => {
        const props = {
            bizLogo,
            bizName,
            txtPColor,
            styles,
            userName,
            ScrollArrow,
            showMainScrollArray,
        };
        if (isCliAdmin)
            return (
                <AsyncClientAdminText
                    {...props}
                    isFromAdminPanel={isFromAdminPanel}
                    iconStyle={iconStyle}
                />
            );
        if (isCliMember) return <AsyncClientMemberText {...props} />;
        if (isCliUser) return <AsyncClientUserText {...props} />;
        if (isBizTeam) return <AsyncBizTeamText {...props} />;
    };

    const showMissingBannerMsg = () => (
        <section className="container-center-col" style={{ marginBottom: 150 }}>
            <p>Se a placa para baixar o app não apareceu. Tente por aqui:</p>
            <div className="my-3">
                <a
                    href={"/mobile-app?abrir=1&banner=1"}
                    className="no-text-decoration"
                >
                    <ButtonFab
                        title="Acessar App"
                        color={
                            txtPColor && txtPColor.includes("text-white")
                                ? "#fff"
                                : "#000"
                        }
                        backgroundColor={`var(--themeS--${
                            pColor || "default"
                        })`}
                        onClick={null}
                        position="relative"
                        variant="extended"
                        size="medium"
                        needBtnShadow
                        shadowColor="white"
                    />
                </a>
            </div>
            {showDesktopMsg && (
                <Fragment>
                    <p className="text-center my-3">ou</p>
                    <p>
                        Se você estiver usando o Desktop e o app já está
                        instalado, basta encontrar o app na seu desktop ou abra
                        o seu app com o botão similar a este:
                    </p>
                    <div className="container-center">
                        <img
                            src="/img/demos/pwa/button-to-open-pwa-desktop.png"
                            width="189"
                            height="auto"
                            alt="botão abri app desktop"
                        />
                    </div>
                </Fragment>
            )}
        </section>
    );

    return (
        <section className="target--content-download">
            {showSpinner()}
            {(isLinkInvalid || !isAllowedLink) && !isBizTeam ? (
                errorMsg()
            ) : (
                <Fragment>
                    <section className={`mx-3 text-normal ${txtBackColor}`}>
                        {handleAppTypeText()}
                        {downloadAvailable && showMissingBannerMsg()}
                        {!downloadAvailable && showAlreadyDownloadedApp()}
                    </section>
                    <PwaInstaller
                        title={
                            isCliAdmin
                                ? `<strong>${
                                      userName && userName.cap()
                                  },<br />baixe o app aqui</strong><br />e tenha <strong>acesso rápido</strong><br />ao seu painel de controle.`
                                : `<strong>${
                                      userName ? userName.cap() : "Ei"
                                  },<br />baixe nosso app aqui</strong><br />e tenha <strong>acesso rápido</strong><br />aos seus pontos de fidelidade.`
                        }
                        icon={`${CLIENT_URL}/img/official-logo-white.png`}
                        run={run}
                        setData={setData}
                    />
                    {testMode && (
                        <p
                            className="mt-5 text-normal mx-3 text-white"
                            style={{ marginBottom: 150 }}
                        >
                            TESTE:
                            <br />
                            downloadAvailable:{" "}
                            {JSON.stringify(downloadAvailable)}
                            <br />
                            analysis: {JSON.stringify(analysis)}
                            <br />
                            run: {JSON.stringify(run)}
                            <br />
                            beforeinstallprompt:{" "}
                            {JSON.stringify(beforeinstallprompt)}
                            appinstalled: {JSON.stringify(appinstalled)}
                            <br />
                            relatedInstalledApps:{" "}
                            {JSON.stringify(relatedInstalledApps)}
                        </p>
                    )}
                </Fragment>
            )}
        </section>
    );
}

/*
<p>{!isInstalled ? parse("<br /><br />Foi instalado.<br/>Visite sua galeria<br />de Apps") : ""}</p>
FOR TESTING VERSIONS: <span className="text-right">{"t5"}</span>
*/
