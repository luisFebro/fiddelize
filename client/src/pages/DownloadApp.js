import React, { useState, useEffect, Fragment } from 'react';
import ScrollArrow from '../keyframes/built/scroll-arrow/ScrollArrow';
import AOS from 'aos';
import parse from 'html-react-parser';
import PwaInstaller from '../components/pwa-installer/PwaInstaller';
import { CLIENT_URL } from '../config/clientUrl';
import checkIfElemIsVisible from '../utils/window/checkIfElemIsVisible';
import getQueryByName from '../utils/string/getQueryByName';
import { useClientAdmin } from '../hooks/useRoleData';
import { readClientAdmin } from '../redux/actions/userActions';
import lStorage, { setSystemOp, needAppRegisterOp } from '../utils/storage/lStorage';
import { useStoreDispatch } from 'easy-peasy';
import { showSnackbar } from '../redux/actions/snackbarActions';
import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';

const isSmall = window.Helper.isSmallScreen();
const truncate = (name, leng) => window.Helper.truncate(name, leng);

const iconStyle = {
   fontSize: '140px',
   color: 'var(--mainWhite)',
   filter:  'drop-shadow(.5px .5px 1.5px black)',
}

const appSystem = lStorage("getItems", { collection: "appSystem"});

// Valid links:
// general: site/baixe-app?negocio=${bizName}&id=${bizId}&cliente=1
// custom name: site/baixe-app/${name}?negocio=${bizName}&id=${bizId}&cliente=1

export default function DownloadApp({ match, location }) {
    const bizName = getQueryByName("negocio", location.search);
    const bizId = getQueryByName("id", location.search);
    const isClientAdmin = location.search.includes("admin=1");
    const isFromAdminPanel = location.search.includes("painel=1");
    const isClientUser = location.search.includes("cliente=1"); // need to be implmenet in the sharer page.
    const isValidRoleType = isClientAdmin || isClientUser;

    const isAdminLoggedIn = appSystem && appSystem.roleWhichDownloaded === "cliente-admin";
    if(isClientAdmin) { lStorage("setItems", setSystemOp("cliente-admin", bizId)); }
    if(isClientUser && !isAdminLoggedIn) {
        lStorage("setItems", setSystemOp("cliente", bizId));
        lStorage("setItem", {...needAppRegisterOp, value: true});
    } // L

    let [userName, setUserName] = useState(match.params.userName);
    userName = userName && userName.replace(/\+/g, " ");
    const [run, setRun] = useState(false);
    const [needSelfServiceData, setNeedSelfServiceData] = useState(false);
    const [downloadAvailable, setDownloadAvailable] = useState(false);

    const dispatch = useStoreDispatch();
    const { selfBizLogoImg, selfMilestoneIcon, selfThemePColor, selfThemeSColor, selfThemeBackColor, } = useClientAdmin();

    if(needSelfServiceData) {
        const clientAdminData = {
            selfBizLogoImg,
            selfMilestoneIcon,
            selfThemePColor,
            selfThemeSColor,
            selfThemeBackColor,
        }
        const clientAdminColl = { collection: "clientAdmin", newObj: clientAdminData };
        lStorage("setItems", clientAdminColl);
    }

    useEffect(() => {
        readClientAdmin(dispatch, bizId)
        .then(res => {
            if(res.status !== 200) return showSnackbar(dispatch, "Ocorreu um problema. Verifique sua conexão", 'error')
            setNeedSelfServiceData(true);
        })
    }, [bizId])



    useEffect(() => {
        checkIfElemIsVisible(".target", setRun, true);
    }, [run])

    AOS.init({
        offset: 10,
    });

    const styles = {
        icon: {
            fontSize: isClientAdmin ? '6rem' : '3rem',
            fontWeight: 'bold',
        },
        margin: {
            marginTop: '110px',
        }
    }

    const showClientAdminText = () => (
        <div className="text-white text-center text-title mt-5">
            {isFromAdminPanel ? (
                <Fragment>
                    <p className="text-hero container-center-col">
                        <ImportantDevicesIcon style={iconStyle} />
                        {userName && userName.cap()}, baixe seu app seja para celular, tablet ou desktop.
                    </p>
                    <div className="pt-1 pb-5">
                        <ScrollArrow margin={50} />
                    </div>
                    <p
                        style={styles.margin}
                        data-aos="fade-up"
                    >
                        Clique no banner que aparece a baixo,
                        <br />
                        e comece a baixar em instantes.
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
                    <p
                        style={styles.margin}
                        data-aos="fade-up"
                    >
                        Baixe logo a baixo,
                        <br />
                        e já comece a usar.
                    </p>
                </Fragment>
            )}
            <div style={{display: downloadAvailable ? 'block' : 'none', margin: '0 0 300px'}}>
                <ScrollArrow margin={30} />
                <div className="target">
                    <ScrollArrow margin={30} />
                </div>
            </div>
        </div>
    );

    const showAppShowCase = () => (
        <div
            data-aos="fade-up-right"
            data-aos-duration="1500"
            style={{maxWidth: 800, position: 'relative', left: isSmall ? '-125px' : '-239px'}}
        >
            <img className="img-fluid shape-elevation" src="/img/illustrations/app-demo-download-page.png" height="auto" alt="app do celular"/>
        </div>
    );

    const showClientUserText = () => (
        <div className={`${isSmall ? "ml-2 text-left" : "text-center"} mt-4 text-title`}>
            <p
                className={`pl-3 text-center text-hero`}
                style={{lineHeight: 1}}
            >
                {userName
                ? <span>Oi,<br /> {truncate(userName.cap(), isSmall ? 22 : 30)}</span>
                : <span>Caro cliente,</span>}
            </p>
            <div className="ml-2">
                {isClientUser && (
                    <Fragment>
                        <p>Você foi convidado(a) para baixar o app de </p>
                        <p className="text-hero text-center">{bizName && bizName.cap()}</p>
                        <p>
                            para te oferecer uma <strong>experiência de compra</strong> ainda melhor
                            <br />
                            e <strong>valorizar sua fidelidade.</strong>
                        </p>

                        {showAppShowCase()}

                        <p style={styles.margin} data-aos="fade-up">Você vai acompanhar seus pontos de fidelidade, histórico de compras, conversar com a gente, ter acesso offline e mais.</p>
                        <p className="text-hero" style={styles.margin} data-aos="fade-up">E o melhor...<br />você ainda ganha prêmios a cada meta atingida!</p>
                        <p
                            style={styles.margin}
                            data-aos="fade-up"
                        >
                            Baixe o seu app logo a baixo,
                            <br />
                            é leve e baixa rápido.
                        </p>
                        <div style={{display: downloadAvailable ? 'block' : 'none', margin: '0 0 300px'}}>
                            <ScrollArrow margin={30} />
                            <div id="target">
                                <ScrollArrow margin={30} />
                            </div>
                        </div>
                    </Fragment>
                )}
            </div>
        </div>
    );

    const errorMsg = () => (
        <div className="text-white text-center">
            <p
                className={`pl-3 mt-5 text-center text-hero`}
            >
                Oops! Parece que esse link não é válido.
            </p>
            <p
                className={`${isSmall ? "ml-2 text-left" : "text-center"} my-5 text-title`}
            >
                Por favor, tente um outro link para baixar seu app.
            </p>
            {/*FUTURE UPDATE*/}
            <div style={{display: 'none'}}>
                A button which will take the user to a choose the company's page
                in order to get the right link again...
            </div>
        </div>

    );

    const showAlreadyDownloadedApp = () => {
        return(
            !downloadAvailable &&
            <section className="my-5">
                <div className="container-center">
                    <PhoneIphoneIcon style={{...iconStyle}} />
                </div>
                <p className="text-subtitle font-weight-bold text-white text-center">
                    Você já tem instalado o app de {bizName && bizName.cap()}
                    <br />
                    Verifique na sua tela inicial.
                </p>
            </section>
        );
    }

    const isLinkInvalid = !bizName || !bizId || !isValidRoleType;
    return (
        <Fragment>
            {isLinkInvalid
            ? errorMsg()
            : (
                <section className="text-white">
                    {isClientAdmin
                    ? showClientAdminText()
                    : showClientUserText()}
                    <PwaInstaller
                        title={isClientAdmin
                            ? `<strong>${userName && userName.cap()},<br />baixe o app aqui</strong><br />e tenha <strong>acesso rápido</strong><br />ao seu painel de controle.`
                            : `<strong>${userName ? userName.cap() : "Ei"},<br />baixe nosso app aqui</strong><br />e tenha <strong>acesso rápido</strong><br />aos seus pontos de fidelidade.`
                        }
                        icon={`${CLIENT_URL}/img/official-logo-white.png`}
                        run={run}
                        setDownloadAvailable={setDownloadAvailable}
                    />
                    {showAlreadyDownloadedApp()}
                </section>
            )}
        </Fragment>
    );
}

/* COMMENTS
n1: LESSON: lStorage does not work with useEffect. just declare in the function body normally...
If you see an error in JSON position, also check local storage for missing comma while editing...
*/
/*
<p>{!isInstalled ? parse("<br /><br />Foi instalado.<br/>Visite sua galeria<br />de Apps") : ""}</p>
FOR TESTING VERSIONS: <span className="text-right">{"t5"}</span>
 */