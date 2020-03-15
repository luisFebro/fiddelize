import React, { useState, useEffect, Fragment } from 'react';
import ScrollArrow from '../keyframes/built/scroll-arrow/ScrollArrow';
import AOS from 'aos';
import parse from 'html-react-parser';
import PwaInstaller from '../components/pwa-installer/PwaInstaller';
import { CLIENT_URL } from '../config/clientUrl';
import checkIfElemIsVisible from '../utils/window/checkIfElemIsVisible';
import getQueryByName from '../utils/string/getQueryByName';
import lStorage, { systemOp } from '../utils/storage/lStorage';
const isSmall = window.Helper.isSmallScreen();
const truncate = (name, leng) => window.Helper.truncate(name, leng);

export default function DownloadApp({ match, location }) {
    const [userName, setUserName] = useState(match.params.userName);
    const [run, setRun] = useState(false);
    const bizName = getQueryByName("negocio", location.search);
    const bizId = getQueryByName("id", location.search);
    const isClientAdmin = location.search.includes("admin=1");
    const isClientUser = location.search.includes("cliente=1"); // need to be implmenet in the sharer page.
    const isValidRoleType = isClientAdmin || isClientUser;
    // `/baixe-app/${name}?negocio=${bizName}&id=${bizId}&cliente=1`
    const { downloadClientAdmin, downloadClientUser, businessId } = systemOp;
    useEffect(() => {
        if(isClientAdmin) { lStorage("setItem", downloadClientAdmin); }
        if(isClientUser) {
            lStorage("setItem", downloadClientUser);
            lStorage("setItem", {...businessId, value: bizId});
        }
    }, [isClientAdmin, isClientUser])

    useEffect(() => {
        checkIfElemIsVisible("#target", setRun, true);
    }, [run])

    AOS.init({
        offset: 50,
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
            <p className="text-hero">O App da {bizName && bizName.cap()} ficou pronto!<i style={styles.icon}>🎉</i></p>
            <div className="pt-1 pb-5">
                <ScrollArrow margin={50} />
            </div>
            <p className="text-title" style={styles.margin} data-aos="fade-up">Baixe o App logo aqui embaixo, deslizando a tela.</p>
            <ScrollArrow margin={30} />
            <div id="target" style={{minHeight: '200px 0'}}>
                <ScrollArrow margin={20} />
            </div>
        </div>
    );

    const showAppShowCase = () => (
        <div
            data-aos="fade-up-right"
            data-aos-duration="1500"
            style={{maxWidth: 800, position: 'relative', left: isSmall ? '-115px' : '-239px'}}
        >
            <img className="img-fluid shape-elevation" src="/img/illustrations/one-hand-held-mobile.png" height="auto" alt="app do celular"/>
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
                        <p>Você foi convidado(a) para baixar o app do(a)</p>
                        <p className="text-hero text-center">{bizName && bizName.cap()}</p>
                        <p>
                            para te oferecer uma <strong>experiência de compra</strong> ainda melhor
                            <br />
                            e <strong>valorizar sua fidelidade.</strong>
                        </p>

                        {showAppShowCase()}

                        <p style={styles.margin} data-aos="fade-up">Você vai acompanhar seus pontos de fidelidade, histórico de compras, conversar com a gente, ter acesso offline e mais.</p>
                        <p className="text-hero" style={styles.margin} data-aos="fade-up">E o melhor...<br />você ainda ganha prêmios a cada meta atingida!</p>
                        <p style={styles.margin} data-aos="fade-up">Baixe o seu app aqui embaixo, é leve e baixa rápido.</p>
                        <div style={{margin: '0 0 500px'}}>
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
            <p className={`${isSmall ? "ml-2 text-left" : "text-center"} my-5 text-title`}>Por favor, tente um outro link para baixar seu app.</p>
        </div>

    );

    return (
        <Fragment>
            {!bizName || !bizId || !isValidRoleType
            ? errorMsg()
            : (
                <div id="holder" className="text-white gradient-animation" style={{minHeight: '325vmin'}}>
                    {isClientAdmin
                    ? showClientAdminText()
                    : showClientUserText()}
                    <PwaInstaller
                        title={isClientAdmin
                            ? `<strong>${userName && userName.cap()},<br />baixe o app aqui</strong><br />e tenha <strong>acesso rápido</strong><br />ao seu painel de controle.`
                            : `<strong>${userName ? userName.cap() : "Ei"},<br />baixe nosso app aqui</strong><br />e tenha <strong>acesso rápido</strong><br />aos seus pontos de fidelidade.`
                        }
                        icon={`${CLIENT_URL}/img/official-logo-white.svg`}
                        run={run}
                    />
                </div>
            )}
        </Fragment>
    );
}

/*
<p>{!isInstalled ? parse("<br /><br />Foi instalado.<br/>Visite sua galeria<br />de Apps") : ""}</p>
FOR TESTING VERSIONS: <span className="text-right">{"t5"}</span>
 */