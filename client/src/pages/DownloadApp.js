import React, { useState, useEffect, Fragment } from 'react';
import ScrollArrow from '../keyframes/built/scroll-arrow/ScrollArrow';
import AOS from 'aos';
import parse from 'html-react-parser';
import PwaInstaller from '../components/pwa-installer/PwaInstaller';
import { CLIENT_URL } from '../config/clientUrl';
import checkIfElemIsVisible from '../utils/window/checkIfElemIsVisible';
const isSmall = window.Helper.isSmallScreen();
const truncate = (name, leng) => window.Helper.truncate(name, leng);

export default function DownloadApp({ match, location }) {
    const [userName, setUserName] = useState(match.params.userName);
    const [run, setRun] = useState(false);
    const isFromRegister = location.search.includes("isFromRegister=true");

    useEffect(() => {
        checkIfElemIsVisible("#target", setRun, true);
    }, [run])

    AOS.init({
        offset: 50,
    });

    const styles = {
        icon: {
            fontSize: '3rem',
            fontWeight: 'bold',
        },
        margin: {
            marginTop: '110px',
        }
    }

    const showMainText = () => (
        <div className="text-left text-title">
            <p
                className={`pl-3 ${isSmall ? "text-center" : "text-left"} text-hero`}
                style={{lineHeight: 1}}
            >
                Oi,<br /> {truncate(userName.cap(), isSmall ? 22 : 30)}
            </p>
            <div className="ml-2">
                {isFromRegister
                ? (
                    <Fragment>
                        <p>Você foi registrado(a) com sucesso! <i style={styles.icon}>🎉</i></p>
                        <p className="my-1" data-aos="fade-up" data-aos-delay="150">{parse(`Seja ${isSmall ? "<br />" : ""} bem-vindo(a)!`)}</p>
                        <ScrollArrow />
                        <p style={styles.margin} data-aos="fade-up">Baixe o app da Fiddelize e faça seu login de acesso por lá.</p>
                        <ScrollArrow margin={30}/>
                        <p style={styles.margin} data-aos="fade-up">É leve e baixa em segundos!</p>
                        <ScrollArrow margin={30} />
                        <div id="target" style={{minHeight: '200px 0'}}>
                            <ScrollArrow margin={20} />
                        </div>
                    </Fragment>
                ) : (
                    <Fragment>
                        <p>Você foi indicado(a) para baixar o App de pontos de fidelidade da varempresa</p>
                        <ScrollArrow margin={20}/>
                        <p style={styles.margin} data-aos="fade-up">Acompanhe seus pontos em tempo real com um clique!</p>
                        <ScrollArrow margin={20}/>
                        <p style={styles.margin} data-aos="fade-up">Deslize e Baixe o app. Você faz seu cadastro por lá.</p>
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

    return (
        <div id="holder" className="text-white gradient-animation" style={{minHeight: '325vmin'}}>
            {showMainText()}
            <PwaInstaller
                title={`<strong>${userName.cap()},<br />baixe nosso app aqui</strong><br />e tenha <strong>acesso rápido</strong><br />aos seus pontos de fidelidade.`}
                icon={`${CLIENT_URL}/icons/android-chrome-256x256.png`}
                run={run}
            />
        </div>
    );
}

/*
<p>{!isInstalled ? parse("<br /><br />Foi instalado.<br/>Visite sua galeria<br />de Apps") : ""}</p>
FOR TESTING VERSIONS: <span className="text-right">{"t5"}</span>
 */