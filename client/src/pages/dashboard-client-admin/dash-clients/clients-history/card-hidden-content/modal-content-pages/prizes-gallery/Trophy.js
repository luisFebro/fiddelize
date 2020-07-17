import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ImgLoader from '../../../../../../../components/ImgLoader';

const trophyTypes = {
    custom: '/img/icons/trophies/gallery-trophy.svg',
    semisecret: '/img/icons/trophies/trophy-silhouette.svg',
    secret: '/img/icons/trophies/trophy-secret-silhouette.png',
}

const truncate = (name, leng) => window.Helper.truncate(name, leng);

export default function Trophy({ data }) {

    let {
        type = "custom",
        challN = 1,
        challIcon = "heart",
        prizeDesc = "Um par de ingressos",
        isConfirmed = true,
        isDelivered = true,
    } = data;

    const isTypeSecret = type === "secret";
    const isTypeCustom = type === "custom";

    if(isTypeSecret) {
        prizeDesc = "";
        challIcon = "";
    }

    const showIconStatus = status => {
        return status
        ? <FontAwesomeIcon icon="check" className="ok-icon" />
        : <FontAwesomeIcon icon="times" className="pending-icon" />
    };

    const showPrizeStatusIcons = () => (
        <section className={`${isTypeCustom ? undefined : "d-none"} prize-status-icons`}>
            <section className="confirmed">
                <div className="status-icon">
                    {showIconStatus(isConfirmed)}
                </div>
                <div className={`icon ${isConfirmed ? "ok" : "pending"}`}>
                    <FontAwesomeIcon icon="thumbs-up" className={`${isConfirmed ? "shadow" : ""}`} />
                </div>
            </section>
            <section className="delivered">
                <div className="status-icon">
                    {showIconStatus(isDelivered)}
                </div>
                <div className={`icon ${isDelivered ? "ok" : "pending"}`}>
                    <FontAwesomeIcon icon="hand-holding" className={`${isDelivered ? "shadow" : ""}`} />
                </div>
            </section>
        </section>
    );

    const description = prizeDesc && truncate(prizeDesc, 18);
    return (
        <section className="trophy--root">
            <h2 className={`${isTypeCustom ? "text-purple" : "text-grey"} text-center text-subtitle font-weight-bold`}>
                Desafio<br />n.º {challN}
            </h2>
            <section className="trophy-design">
                <div className="d-block">
                    <ImgLoader
                        mode="skeleton"
                        skelWidth={125}
                        src={trophyTypes[type]}
                        className={isTypeCustom ? "shadow-elevation-black" : undefined}
                        alt="troféu"
                        width={150}
                        height="auto"
                    />
                </div>
                <div
                    className="custom-icon"
                    style={{ filter: `${isTypeCustom ? 'drop-shadow(.01em 2px .01em grey)' : ''}`}}
                >
                    <FontAwesomeIcon icon={challIcon} />
                </div>
                {showPrizeStatusIcons()}
            </section>
            {!isTypeSecret && (
                <section className={`${isTypeCustom ? "text-purple" : "text-grey"} prize-desc text-normal text-center`}>
                    {description}
                </section>
            )}
        </section>
    );
}