import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const trophyTypes = {
    default: './img/icons/trophies/fiddelize-trophy.svg', // if star.
    custom: './img/icons/trophies/gallery-trophy.svg',
    placeholder: './img/icons/trophies/trophy-silhouette.svg',
    secret: './img/icons/trophies/trophy-secret-silhouette.png',
}

const truncate = (name, leng) => window.Helper.truncate(name, leng);

export default function Trophy({ data }) {

    const {
        type = "default",
        challN = 1,
        challIcon = "heart",
        prizeDesc = "Um par de ingressos",
        isConfirmed = true,
        isDelivered = true,
        finalGoal = 0,
        createdAt = new Date(),
    } = data;

    const showIconStatus = status => {
        return status
        ? <FontAwesomeIcon icon="check" className="ok-icon" />
        : <FontAwesomeIcon icon="times" className="pending-icon" />
    };


    const showPrizeStatusIcons = () => (
        <section className="prize-status-icons">
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

    const description = truncate(prizeDesc, 18);

    return (
        <section className="trophy--root">
            <h2 className="text-center text-subtitle text-purple font-weight-bold">
                Desafio<br />n.º {challN}
            </h2>
            <section className="trophy-design">
                <div className="d-block">
                    <img
                        src={trophyTypes[type]}
                        className="trphy-img shadow-elevation-black"
                        alt="troféu"
                        width={150}
                        height="auto"
                    />
                </div>
                <div className="custom-icon">
                    <FontAwesomeIcon icon={challIcon} />
                </div>
                {showPrizeStatusIcons()}
            </section>
            <section className="prize-desc text-normal text-center text-purple">
                {description}
            </section>
        </section>
    );
}