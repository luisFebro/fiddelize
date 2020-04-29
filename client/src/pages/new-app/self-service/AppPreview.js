import React from 'react';
import { CLIENT_URL } from '../../../config/clientUrl';
import { useRunComp } from '../../../hooks/useRunComp';
import MobileScreenLoading from '../../../components/loadingIndicators/MobileScreenLoading'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './style.scss';

export default function AppPreview({ clientName }) {
    const { runName } = useRunComp();

    const showBlob = () => (
        <div className="app-preview-blob animated slideIn">
            <img
                src={`${CLIENT_URL}/img/shapes/blob-app-preview.svg`}
                alt="blob app visualização"
            />
        </div>
    );

    const showAppIframe = () => (
        <div
            className="app-preview-iframe"
        >
            <iframe
                src={`${CLIENT_URL}/mobile-app/preview?runName=${runName}&clientName=${clientName}`}
                allowFullScreen={false}
                width={330}
                height={450}
            >
            </iframe>
        </div>
    );

    const showPhoneFrame = () => (
        <div className="app-preview-phone-frame" style={{cursor: "pointer"}}>
            <img
                src={`${CLIENT_URL}/img/illustrations/phone-preview.png`}
                alt="celular"
                width={335}
                height={500}
            />
        </div>
    );

    const showLoading = () => (
        <div
            className="app-loading-screen"
        >
            <MobileScreenLoading />
        </div>
    );

    const showPhoneTitle = () => (
        <div className="title-for-phone">
            Resultado App
            <br />
            em tempo real.
        </div>
    );

    const showScrollInstruDesktop = () => (
        <div className="scroll-instru-desktop text-shadow text-normal">
            <p>
                Deslize
                <br />
                aqui
            </p>
            <FontAwesomeIcon icon="long-arrow-alt-down" style={{color: "var(--mainWhite)", fontSize: '30px', zIndex: 10}} />
        </div>
    );

    const showWarning = () => (
        <div className="text-small text-purple text-center">
            * App para fins de visual,
            <br />
            funcionalidades desativadas.
        </div>
    );

    return (
        <section  className="live-app-area container-center">
            <section className="app-phone">
                {showPhoneTitle()}
                {showPhoneFrame()}
                {showAppIframe()}
                {showLoading()}
                {showWarning()}
                {showScrollInstruDesktop()}
            </section>
            {showBlob()}
        </section>
    );
}