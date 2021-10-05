import { useState, useEffect, useMemo, Fragment } from "react";
import { setItems } from "init/lStorage";
import ScrollArrow from "components/animations/scroll-arrow/ScrollArrow";
import PwaInstaller from "components/pwa-installer/PwaInstaller";
import { CLIENT_URL } from "config/clientUrl";
import checkIfElemIsVisible from "utils/window/checkIfElemIsVisible";
import { useBizData } from "init";
import Spinner from "components/loadingIndicators/Spinner";
import useAnimateElem from "hooks/scroll/useAnimateElem";
import useBackColor from "hooks/useBackColor";
import getColor from "styles/txt";
import { Load } from "components/code-splitting/LoadableComp";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import BackButton from "components/buttons/BackButton";
import runLinkTagOnClick from "utils/tags/runLinkTagOnClick";
import showToast from "components/toasts";
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
        testMode,
        appinstalled,
        relatedInstalledApps,
        beforeinstallprompt,
    } = data;

    const matchName = match.params.userName;
    const userName = matchName && matchName.replace(/\+/g, " ").cap();
    // MAIN VARIABLES
    // WARNING: do not change the variables order below
    const [
        // mainQueries
        bizName,
        bizId,
        bizLogo,
        backColor,
        pColor,
        sColor,
        encryptedPTS,
        memberJob,
        memberName,
        linkId, // cli-member or cli-admin register id in db
        linkCode, // e.g vocariza_ana:abc123
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
    const { txtColor: txtPColor } = getColor(pColor);
    const { txtColor } = getColor(backColor);
    // END STYLES

    // HOOKS
    const isAllowedLink = useAllowedLink({
        bizId,
        isCliUser,
        whichRole,
        encryptedPTS,
        linkCode,
    });

    // STORAGE
    const dataRoleStorage = {
        encryptedPTS,
        whichRole,
        bizId,
        memberId: linkId,
        memberJob,
        memberName,
        primaryAgent,
        linkCode,
        bizName,
    };

    useDataStorage({
        pColor,
        sColor,
        backColor,
        bizLogo,
        bizId,
        bizName,
        isAllowedLink,
        dataRoleStorage,
        whichRole,
    });
    // END STORAGE

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
            memberName,
            encryptedPTS,
            linkCode,
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

    const showWebModeBtn = () => (
        <section
            className="mx-3 web-mode-download-btn container-center-col"
            style={{ marginBottom: 250 }}
        >
            <div className="my-3">
                <img
                    className="shadow-babadoo"
                    height="100%"
                    width={250}
                    src="/img/demos/pwa/download-board.png"
                    alt="placa para baixar app web"
                />
            </div>
            <p className="text-purple mx-3 my-4" style={{ textShadow: "none" }}>
                A placa para baixar o app <strong>não apareceu</strong> na sua
                tela ou precisa de <strong>ajuda</strong>?
            </p>
            <div className="mb-3">
                <ButtonFab
                    title="Tente modo web"
                    color={
                        txtPColor && txtPColor.includes("text-white")
                            ? "#fff"
                            : "#000"
                    }
                    backgroundColor={`var(--themeSDark--${
                        pColor || "default"
                    })`}
                    onClick={async () => {
                        await Promise.all([
                            showToast("Iniciando e redirecionando...", {
                                dur: 10000,
                            }),
                        ]);
                        runLinkTagOnClick("/app?placa=1", { target: "_self" });
                    }}
                    position="relative"
                    variant="extended"
                    width="100%"
                    size="large"
                    needBtnShadow
                    shadowColor="white"
                />
            </div>
            <style jsx>
                {`
                    .web-mode-download-btn {
                        background-color: var(--mainWhite);
                        border-radius: 15px;
                    }
                `}
            </style>
        </section>
    );

    const showBackColor = () => (
        <section style={{ position: "absolute", top: -20, left: -20 }}>
            <BackButton
                onClick={() =>
                    history.push("/negocio/novo-clube/cadastro-admin")
                }
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
                    <section className={`text-normal ${txtColor}`}>
                        {handleAppTypeText()}
                        {downloadAvailable && showWebModeBtn()}
                        {!downloadAvailable && showAlreadyDownloadedApp()}
                    </section>
                    <PwaInstaller
                        title={handlePwaTitle({
                            isCliAdmin,
                            isBizTeam,
                            isCliMember,
                            userName,
                        })}
                        icon={pickIconForBanner({ isBizTeam, bizLogo })}
                        isBizTeam={isBizTeam}
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

// HOOKS
function useDataStorage({
    pColor,
    sColor,
    bizLogo,
    backColor,
    bizId,
    bizName,
    isAllowedLink,
    dataRoleStorage,
    whichRole,
}) {
    // fundamental data each role
    useEffect(() => {
        if (isAllowedLink) handleRoleStorage(dataRoleStorage);
        return null;
    }, [isAllowedLink, dataRoleStorage]);
    // end fundamental data each role

    // set app styling
    const { themePColor, themeSColor, themeBackColor } = useBizData();

    const appStyling = useMemo(
        () => ({
            bizId, // for cli-admins, it is null, but no sideeffects since admin has already registed and only need to log in
            bizName,
            bizLogo,
            themePColor: pColor || themePColor,
            themeSColor: sColor || themeSColor,
            themeBackColor: backColor || themeBackColor,
        }),
        // eslint-disable-next-line
        [pColor, themePColor, bizLogo]
    );

    useEffect(() => {
        console.log("whichRole", whichRole);
        setItems("bizData", appStyling);
        setItems("currUser", { role: whichRole });
    }, [appStyling, whichRole]);
    // end set app styling
}
// HOOKS

// HELPERS
function pickIconForBanner({ isBizTeam, bizLogo }) {
    if (isBizTeam) return `${CLIENT_URL}/img/official-logo-white.png`;

    return bizLogo;
}

function handlePwaTitle({ isCliAdmin, isCliMember, isBizTeam, userName }) {
    if (isCliAdmin)
        return `<strong>${
            userName && userName.cap()
        },<br />baixe o app aqui</strong><br />e acesse rápido seu painel de controle.`;

    if (isCliMember)
        return `<strong>${
            userName ? userName.cap() : "Ei"
        },<br />baixe o app<br />no botão ao lado.`;

    if (isBizTeam)
        return `<strong>${
            userName ? userName.cap() : "Ei"
        },<br />baixe o app comercial<br />da Fiddelize aqui`;

    return `<strong>${
        userName ? userName.cap() : "Ei"
    },<br />baixe nosso app aqui</strong>`;
}
// END HELPERS

/*
<p>{!isInstalled ? parse("<br /><br />Foi instalado.<br/>Visite sua galeria<br />de Apps") : ""}</p>
FOR TESTING VERSIONS: <span className="text-right">{"t5"}</span>
*/
