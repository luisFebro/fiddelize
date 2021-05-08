import { useState, useEffect, Fragment } from "react";
import { setItems } from "init/lStorage";
import ScrollArrow from "components/animations/scroll-arrow/ScrollArrow";
import PwaInstaller from "components/pwa-installer/PwaInstaller";
import { CLIENT_URL } from "config/clientUrl";
import checkIfElemIsVisible from "utils/window/checkIfElemIsVisible";
import { useBizData } from "init";
import Spinner from "components/loadingIndicators/Spinner";
import useAnimateElem from "hooks/scroll/useAnimateElem";
import useBackColor from "hooks/useBackColor";
import selectTxtStyle from "utils/biz/selectTxtStyle";
import { Load } from "components/code-splitting/LoadableComp";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import BackButton from "components/buttons/BackButton";
import getQueries from "./helpers/getQueries";
import handleRoleStorage from "./helpers/handleRoleStorage";
import useAllowedLink from "./hooks/useAllowedLink";

const isSmall = window.Helper.isSmallScreen();

export const AsyncDetectedApp = Load({
    loader: () =>
        import(
            "./detected-app/DetectedApp" /* webpackChunkName: "detected-app-comp-lazy" */
        ),
});

export const AsyncNotInstalledInstru = Load({
    loader: () =>
        import(
            "./NotInstalledInstru" /* webpackChunkName: "not-installed-instru-comp-lazy" */
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

export default function DownloadApp({ match, location, history }) {
    const [isPageReady, setPageReady] = useState(false);
    const [data, setData] = useState({
        run: false,
        downloadAvailable: false, // LESSON: false is default
        analysis: true,
        showNotInstalledInstru: false,
        needSelfServiceData: false,
        // for test only
        testMode: false,
        appinstalled: "none",
        relatedInstalledApps: "none",
        beforeinstallprompt: "none",
    });

    const {
        run,
        downloadAvailable,
        analysis,
        showNotInstalledInstru,
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
        // mainQueries
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
        // others
        isPanel,
        isLinkInvalid,
        whichRole,
        primaryAgent,
        needSelfServBackBtn,
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
    const isAllowedLink = useAllowedLink({
        bizId,
        isCliUser,
        isCliAdmin,
        userScore,
    });
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
    // END HOOKS

    // STORAGE
    if (isAllowedLink) {
        handleRoleStorage({
            userScore,
            whichRole,
            bizId,
            memberId: linkId,
            memberJob,
            primaryAgent,
        });
    }
    // admin app config
    const {
        milestoneIcon,
        themePColor,
        themeSColor,
        themeBackColor,
    } = useBizData();

    useEffect(() => {
        if (whichRole !== "cliente-admin") return;

        setData((prev) => ({ ...prev, needSelfServiceData: true }));
    }, [bizId, whichRole]);

    if (needSelfServiceData) {
        const newBizData = {
            bizLogo,
            milestoneIcon,
            themePColor,
            themeSColor,
            themeBackColor,
        };
        setItems("bizData", newBizData);
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
            <p className="pl-3 mt-5 text-center text-hero">
                Oops! Parece que esse link não é válido ou já usado.
            </p>
            <p
                className={`${
                    isSmall ? "ml-2 text-left" : "text-center"
                } my-5 text-title`}
            >
                Por favor, tente um outro link para baixar seu app.
            </p>
            {/* FUTURE UPDATE */}
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
                    isFromAdminPanel={isPanel}
                    iconStyle={iconStyle}
                />
            );
        if (isCliMember) return <AsyncClientMemberText {...props} />;
        if (isCliUser) return <AsyncClientUserText {...props} />;
        if (isBizTeam)
            return <AsyncBizTeamText {...props} primaryAgent={primaryAgent} />;
    };

    const handleNotInstalled = () => {
        setData({
            ...data,
            showNotInstalledInstru: true,
        });
    };

    const showTroubleShooting = () => (
        <section className="container-center-col" style={{ marginBottom: 150 }}>
            <h2 className="text-subtitle text-center text-white">
                Soluções comuns para baixar app
            </h2>
            <p>
                Se a placa/banner para baixar o app não apareceu nesta página.
                Tente por aqui:
            </p>
            <div className="my-3">
                <a
                    href="/mobile-app?abrir=1&banner=1"
                    className="no-text-decoration"
                >
                    <ButtonFab
                        title="Acessar App"
                        color={
                            txtPColor && txtPColor.includes("text-white")
                                ? "#fff"
                                : "#000"
                        }
                        backgroundColor={`var(--themeSDark--${
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
            <Fragment>
                <p className="text-center my-3">ou</p>
                <p className="mb-3">
                    O app web ainda não apareceu na sua tela inicial?
                </p>
                {!showNotInstalledInstru ? (
                    <ButtonFab
                        title="Ver Instruções"
                        color={
                            txtPColor && txtPColor.includes("text-white")
                                ? "#fff"
                                : "#000"
                        }
                        backgroundColor={`var(--themeSDark--${
                            pColor || "default"
                        })`}
                        onClick={handleNotInstalled}
                        position="relative"
                        variant="extended"
                        size="medium"
                        needBtnShadow
                        shadowColor="white"
                    />
                ) : (
                    <AsyncNotInstalledInstru />
                )}
            </Fragment>
        </section>
    );

    const showBackColor = () => (
        <section style={{ position: "absolute", top: -20, left: -20 }}>
            <BackButton
                onClick={() => history.push("/negocio/novo-app/cadastro-admin")}
            />
        </section>
    );

    return (
        <section className="target--content-download">
            {showSpinner()}
            {needSelfServBackBtn && showBackColor()}
            {(isLinkInvalid || !isAllowedLink) && !isBizTeam && !isCliAdmin ? (
                errorMsg()
            ) : (
                <Fragment>
                    <section className={`mx-3 text-normal ${txtBackColor}`}>
                        {handleAppTypeText()}
                        {downloadAvailable && showTroubleShooting()}
                        {!downloadAvailable && showAlreadyDownloadedApp()}
                    </section>
                    <PwaInstaller
                        title={handlePwaTitle({
                            isCliAdmin,
                            isBizTeam,
                            userName,
                        })}
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

function handlePwaTitle({ isCliAdmin, isBizTeam, userName }) {
    if (isCliAdmin)
        return `<strong>${
            userName && userName.cap()
        },<br />baixe o app aqui</strong><br />e tenha <strong>acesso rápido</strong><br />ao seu painel de controle.`;

    if (isBizTeam)
        return `<strong>${
            userName ? userName.cap() : "Ei"
        },<br />baixe o app comercial<br />da Fiddelize aqui`;

    return `<strong>${
        userName ? userName.cap() : "Ei"
    },<br />baixe nosso app aqui</strong><br />e tenha <strong>acesso rápido</strong><br />aos seus pontos de fidelidade.`;
}

/*
<p>{!isInstalled ? parse("<br /><br />Foi instalado.<br/>Visite sua galeria<br />de Apps") : ""}</p>
FOR TESTING VERSIONS: <span className="text-right">{"t5"}</span>
*/
