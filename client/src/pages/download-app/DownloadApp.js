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
import PhoneIphoneIcon from "@material-ui/icons/PhoneIphone";
import Spinner from "../../components/loadingIndicators/Spinner";
import useElemShowOnScroll from "../../hooks/scroll/useElemShowOnScroll";
import useAnimateElem from "../../hooks/scroll/useAnimateElem";
import useBackColor from "../../hooks/useBackColor";
import selectTxtStyle from "../../utils/biz/selectTxtStyle";
import getQueries from "./helpers/getQueries";
import { handleRoleStorage } from "./helpers";
import useAllowedLink from "./hooks/useAllowedLink";
import { Load } from "../../components/code-splitting/LoadableComp";
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
    let [userName, setUserName] = useState(match.params.userName);
    const [run, setRun] = useState(false);
    const [needSelfServiceData, setNeedSelfServiceData] = useState(false);
    const [downloadAvailable, setDownloadAvailable] = useState(false);
    const [analysis, setAnalysis] = useState(true);

    userName = userName && userName.replace(/\+/g, " ").cap();

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
        checkIfElemIsVisible(".target-download", (res) => setRun(res));
        if (run) {
            setTimeout(() => setAnalysis(false), 5000);
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
            setNeedSelfServiceData(true);
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
        const icon = () => (
            <div className="container-center">
                <PhoneIphoneIcon style={{ ...iconStyle }} />
            </div>
        );
        return (
            !downloadAvailable && (
                <section className="my-5">
                    {icon()}
                    {run && !analysis && (
                        <p className="animated rubberBand text-subtitle font-weight-bold text-center">
                            Você já tem instalado o app de{" "}
                            {bizName && bizName.cap()}
                            <br />
                            Verifique na sua tela inicial.
                        </p>
                    )}
                    {run && analysis && (
                        <p className="text-subtitle font-weight-bold text-white text-center">
                            Analisando...
                        </p>
                    )}
                </section>
            )
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

    return (
        <section className="target--content-download">
            {showSpinner()}
            {(isLinkInvalid || !isAllowedLink) && !isBizTeam ? (
                errorMsg()
            ) : (
                <section className={`${txtBackColor}`}>
                    {handleAppTypeText()}
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
                        setDownloadAvailable={setDownloadAvailable}
                    />
                    {showAlreadyDownloadedApp()}
                </section>
            )}
        </section>
    );
}

/*
<p>{!isInstalled ? parse("<br /><br />Foi instalado.<br/>Visite sua galeria<br />de Apps") : ""}</p>
FOR TESTING VERSIONS: <span className="text-right">{"t5"}</span>
*/
