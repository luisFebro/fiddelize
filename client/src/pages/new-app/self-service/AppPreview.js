import React from 'react';
import { CLIENT_URL } from '../../../config/clientUrl';
import './style.scss';

export default function AppPreview() {
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
                src={`${CLIENT_URL}/mobile-app/preview`}
                allowfullscreen={false}
                width={330}
                height={450}
            >
            </iframe>
        </div>
    );

    const showPhoneFrame = () => (
        <div className="app-preview-phone-frame">
            <img
                src={`${CLIENT_URL}/img/illustrations/phone-preview.png`}
                alt="celular"
                width={335}
                height={500}
            />
        </div>
    );

    const showPhoneTitle = () => (
        <div className="title-for-phone">
            Resultado App
            <br />
            em tempo real.
        </div>
    );

    return (
        <section className="live-app-area container-center">
            <section className="app-phone">
                {showPhoneTitle()}
                {showPhoneFrame()}
                {showAppIframe()}
            </section>
            {showBlob()}
        </section>
    );
}