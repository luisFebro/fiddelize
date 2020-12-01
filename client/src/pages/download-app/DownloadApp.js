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
import ImportantDevicesIcon from "@material-ui/icons/ImportantDevices";
import PhoneIphoneIcon from "@material-ui/icons/PhoneIphone";
import Spinner from "../../components/loadingIndicators/Spinner";
import useElemShowOnScroll from "../../hooks/scroll/useElemShowOnScroll";
import useAnimateElem from "../../hooks/scroll/useAnimateElem";
import useBackColor from "../../hooks/useBackColor";
import selectTxtStyle from "../../utils/biz/selectTxtStyle";
import ClientMemberText from "./app-type-texts/ClientMemberText";
import getQueries from "./helpers/getQueries";
import { handleRoleStorage } from "./helpers";

const isSmall = window.Helper.isSmallScreen();
const truncate = (name, leng) => window.Helper.truncate(name, leng);

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
    handleRoleStorage({
        userScore,
        whichRole,
        bizId,
        memberId: linkId,
        memberJob,
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

    const showClientAdminText = () => (
        <div className="text-center text-title mt-5">
            {isFromAdminPanel ? (
                <Fragment>
                    <p className="text-hero container-center-col">
                        <ImportantDevicesIcon style={iconStyle} />
                        {userName && userName.cap()}, baixe seu app seja para
                        celular, tablet ou desktop.
                    </p>
                    <div className="pt-1 pb-5">
                        <ScrollArrow margin={50} />
                    </div>
                    <p className="download-app--txt" style={styles.margin}>
                        Clique no banner que aparece a baixo,
                        <br />e comece a baixar em instantes.
                    </p>
                </Fragment>
            ) : (
                <Fragment>
                    <p className="text-hero">
                        O App da {bizName && bizName.cap()} ficou pronto!
                        <i style={styles.icon}>🎉</i>
                    </p>
                    <div className="pt-1 pb-5">
                        <ScrollArrow margin={50} />
                    </div>
                    <p className="download-app--txt" style={styles.margin}>
                        Baixe logo a baixo,
                        <br />e já comece a usar.
                    </p>
                </Fragment>
            )}
            {showMainScrollArray()}
        </div>
    );

    // Update this with Picture Comp and lazy loading effect: fadeInBottomLeft
    const showAppShowCase = () => (
        <div
            style={{
                maxWidth: 800,
                position: "relative",
                left: isSmall ? "-125px" : "-239px",
            }}
        >
            <img
                className="img-fluid shape-elevation"
                src="/img/illustrations/app-demo-download-page.png"
                height="auto"
                alt="app do celular"
            />
        </div>
    );

    const showClientUserText = () => (
        <section
            className={`${
                isSmall ? "ml-2 text-left" : "text-center"
            } mt-4 text-title`}
        >
            <section className="full-height">
                <div className="my-5 container-center">
                    <img
                        src={
                            bizLogo === "undefined"
                                ? `/img/official-logo-name.png`
                                : bizLogo
                        }
                        className="img-fluid"
                        width={bizLogo === "undefined" && 200}
                        height={bizLogo === "undefined" && 200}
                        title={`logo da ${bizName}`}
                        alt={`logo empresa ${bizName}`}
                    />
                </div>
                <div className="text-center text-hero">
                    <span
                        className="d-block text-title"
                        style={{ lineHeight: "50px" }}
                    >
                        Convite Especial
                        <br />
                        para{" "}
                    </span>
                    <div
                        className={`${txtPColor} d-inline-block mt-2 animated bounce repeat-2 delay-3s`}
                        style={styles.hightlighedName}
                    >
                        {userName ? userName : "você!"}
                    </div>
                    <div className="pt-1 pb-5">
                        <ScrollArrow margin={50} />
                    </div>
                </div>
            </section>
            <p
                className={`px-2 text-center text-hero`}
                style={{ lineHeight: 1 }}
            >
                {userName ? (
                    <span>
                        Oi,
                        <br /> {truncate(userName.cap(), isSmall ? 22 : 30)}
                    </span>
                ) : (
                    <span>Caro cliente,</span>
                )}
            </p>
            <div className="mx-2">
                {isCliUser && (
                    <Fragment>
                        <p>Você foi convidado(a) para baixar o app da </p>
                        <p className="text-hero text-center">
                            {bizName && bizName.cap()}
                        </p>
                        <p>
                            para te oferecer uma{" "}
                            <strong>
                                nova experiência em compras e valorizar sua
                                fidelidade.
                            </strong>
                            <br />
                            <br />
                            Você está prestes a entrar no jogo de compras com
                            desafios e prêmios reais.
                        </p>

                        {showAppShowCase()}

                        <p className="download-app--txt" style={styles.margin}>
                            Você vai acompanhar seus pontos de fidelidade,
                            progresso de desafios, ter histórico compras
                            automático, ter acesso offline, avaliar sua
                            experiência e mais.
                        </p>
                        <p
                            className="download-app--txt text-hero"
                            style={styles.margin}
                        >
                            E o melhor...
                            <br />
                            <span
                                className="mt-3 d-block text-title"
                                style={{ lineHeight: "45px" }}
                            >
                                ganhe prêmios a cada desafio concluído!
                            </span>
                        </p>
                        <p className="download-app--txt" style={styles.margin}>
                            Baixe o seu app logo a baixo.
                            <br />
                            <br />É leve.
                            <br />É rápido.
                            <br />É grátis!
                        </p>
                        {showMainScrollArray()}
                    </Fragment>
                )}
            </div>
        </section>
    );

    const errorMsg = () => (
        <div className="text-white text-center">
            <p className={`pl-3 mt-5 text-center text-hero`}>
                Oops! Parece que esse link não é válido.
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
        if (isCliMember) return <ClientMemberText {...props} />;

        return isCliAdmin ? showClientAdminText() : showClientUserText();
    };

    return (
        <section className="target--content-download">
            {showSpinner()}
            {isLinkInvalid ? (
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
