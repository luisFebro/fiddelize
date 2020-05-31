import React, { Fragment } from 'react';
import VAsyncRegisterClientAdmin from '../components/auth/VAsyncRegisterClientAdmin';
import ScrollArrow from '../keyframes/built/scroll-arrow/ScrollArrow';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import dayjs from 'dayjs';
import moment from 'moment';
import calendar from "dayjs/plugin/calendar";
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
dayjs.extend(calendar);
// import ModalForPermission from '../components/pwa-push-notification/ModalForPermission';
// import showVanillaToast from '../components/vanilla-js/toastify/showVanillaToast'

const isSmall = window.Helper.isSmallScreen();

export default function Home() {
    AOS.init();

    const showSlogon = () => (
        <section className="mt-5 d-flex flex-column flex-md-row justify-content-center align-items-center">
            <div className="align-self-center m-3">
                <img
                    className="svg-elevation"
                    src="/img/official-logo-white.png"
                    alt="logo"
                    width={150}
                    height='auto'
                />
            </div>
            <h1
                className="text-center align-item-center text-md-left text-title text-white"
                style={{ maxWidth: '700px'}}
            >
                Pontos de Fidelidade Digital para seus Clientes
            </h1>
        </section>
    );

    const showAppShowCase = () => (
        <section>
            <p
                data-aos="fade-up"
                data-aos-duration="1500"
                className="ml-4 text-title text-white"
            >
                Combinamos design, sistema e tecnologia de ponta para entregar
                uma experiência única para empreendedores e seus clientes através
                de nossa plataforma de fidelização.
            </p>
            <div style={{margin: isSmall ? '10px 0 100px 0' : '50px 0 100px 0'}} className="d-flex justify-content-center">
                <ScrollArrow color="white" />
            </div>
            <p
                data-aos="fade-up"
                data-aos-duration="1500"
                className="ml-4 text-title text-white text-center"
            >
                Crie hoje seu multi App de<br />
                pontos de fidelidade com<br />
                tecnologia sob medida movido a<br />
                aumentar sua clientela e vendas<br />
            </p>
            <div
                data-aos="fade-up-right"
                data-aos-duration="1500"
                style={{maxWidth: 800, position: 'relative', left: isSmall ? '-105px' : '-230px'}}
            >
                <picture>
                    <source srcSet="/img/illustrations/one-hand-held-mobile.webp" media="(min-width: 500px)" />
                    <source srcSet="/img/illustrations/one-hand-held-mobile-small.webp" media="(max-width: 500px)" />
                    <source srcSet="/img/illustrations/one-hand-held-mobile.png" media="(min-width: 500px)" />
                    <source srcSet="/img/illustrations/one-hand-held-mobile-small.png" media="(max-width: 500px)" />
                    <img
                        className="img-fluid shape-elevation"
                        src="/img/illustrations/one-hand-held-mobile.png"
                        height="auto"
                        alt="app do celular"
                        onError={e => e.src = "/img/illustrations/one-hand-held-mobile.png"}
                    />
                </picture>
            </div>
        </section>
    );

    let date = new Date();
    const daysBefore = 1;
    date.setDate(date.getDate() - daysBefore);

    return(
        <Fragment>
            <span className="text-right text-white for-version-test">
                {"T67"}
            </span>
            <p className="text-white text-hero">
                {dayjs(date).fromNow()}
                <br />
                {moment(date).fromNow()}
                <br />
                <br />
                {moment(date).calendar(null, { sameElse: 'll'})}
                <br />
                {dayjs(date).calendar(null, { sameElse: 'll'})}
            </p>
            {showSlogon()}
            <div style={{margin: isSmall ? '10px 0 100px 0' : '50px 0 100px 0'}} className="d-flex justify-content-center">
                <ScrollArrow color="white" />
            </div>
            {showAppShowCase()}
            <VAsyncRegisterClientAdmin />
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
