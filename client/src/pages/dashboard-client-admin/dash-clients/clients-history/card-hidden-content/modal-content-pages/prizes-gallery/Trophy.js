import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const trophyTypes = {
    default: './img/icons/trophies/fiddelize-trophy.svg', // if star.
    custom: './img/icons/trophies/gallery-trophy.svg',
    placeholder: './img/icons/trophies/trophy-silhouette.svg',
}

export default function Trophy({
    type = "default",
    challN = 1,
    challIcon = "heart",
    prizeDesc = "Um par de ingressos",
    isConfirmed = false,
    isDelivered = false,
}) {

    const showIconStatus = status => {
        return status
        ? <FontAwesomeIcon icon="check" className="ok-icon" />
        : <FontAwesomeIcon icon="times" className="pending-icon" />
    };

    return (
        <section className="trophy--root">
            <h2 className="text-center text-subtitle text-purple font-weight-bold">
                Desafio n.º {challN}
            </h2>
            <section className="prize-status-icons">
                <section className="confirmed">
                    <div className="status-icon">
                        {showIconStatus(isConfirmed)}
                    </div>
                    <div className="icon">
                        <FontAwesomeIcon icon="thumbs-up" />
                    </div>
                </section>
                <section className="delivered">
                    <div className="status-icon">
                        {showIconStatus(isDelivered)}
                    </div>
                    <div className="icon">
                        <FontAwesomeIcon icon="hand-holding" />
                    </div>
                </section>
            </section>
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
            </section>
            <section className="prize-desc text-normal text-center text-purple">
                {prizeDesc}
            </section>
        </section>
    );
}