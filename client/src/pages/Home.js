import React, { Fragment } from 'react';
import Register from '../components/auth/Register';
import ScrollArrow from '../keyframes/built/scroll-arrow/ScrollArrow';
import { Link } from 'react-router-dom';
import AOS from 'aos';
// import ModalForPermission from '../components/pwa-push-notification/ModalForPermission';
// import showVanillaToast from '../components/vanilla-js/toastify/showVanillaToast'

const isSmall = window.Helper.isSmallScreen();

export default function Home() {
    AOS.init();
    // const showToast = () => {
    //     showVanillaToast("Testing", 10000, {avatar: ' '});
    // }

    const showSlogon = () => (
        <section className="mt-2 d-flex flex-column flex-md-row justify-content-center align-items-center">
            <div className="align-self-center mb-3">
                <img
                    className="svg-elevation"
                    src="/img/official-logo-white.svg"
                    alt="logo"
                    width={250}
                    height={250}
                />
            </div>
            <h1
                className="align-item-center text-center text-md-left text-title text-white"
                style={{ maxWidth: '700px'}}
            >
                Pontos de Fidelidade Online<br />para seus Clientes
            </h1>
        </section>
    );

    const showAppShowCase = () => (
        <section>
            <p
                data-aos="fade-up"
                data-aos-duration="1500"
                className="text-title text-white ml-5"
                style={{maxWidth: '700px'}}
            >
                Conquiste seus clientes com um sistema flexível<br />onde eles acessam seus pontos com<br />um clique pelo App.
            </p>
            <div
                data-aos="fade-up-right"
                data-aos-duration="1500"
                style={{maxWidth: 800, position: 'relative', left: isSmall ? '-100px' : '-230px'}}
            >
                <img className="img-fluid shape-elevation" src="/img/illustrations/one-hand-held-mobile.png" height="auto" alt="app do celular"/>
            </div>
        </section>
    );

    return(
        <Fragment>
            <span className="text-right for-version-test">{""}</span>
            {showSlogon()}
            <div style={{margin: isSmall ? '20px 0 100px 0' : '50px 0 100px 0'}} className="d-flex justify-content-center">
                <ScrollArrow color="white" />
            </div>
            {showAppShowCase()}
            <Register />
        </Fragment>
    );
};


/* ARCHIVES
<div className="mt-3 text-subtitle text-center">Acumule pontos e ganhe produtos e serviços</div>
<Link to="/regulamento">
    <div
        className="my-5 text-subtitle font-weight-italic text-center"
        style={{color: "var(--mainPink)", cursor: "pointer"}}
    >
        Consulte<br />as Regras Aqui
    </div>
</Link>
*/