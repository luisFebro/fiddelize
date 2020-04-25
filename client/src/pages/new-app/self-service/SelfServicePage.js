import React, { Fragment } from 'react';
import PickRatingIcon from './PickRatingIcon';
import AppPreview from './AppPreview';
import './style.scss';

export default function SelfServicePage() {
    const showTitle = () => (
        <div className="text-center text-white my-4">
            <p className="text-title">Self-Service</p>
        </div>
    );

    return (
        <Fragment>
            {showTitle()}
            <div className="main-self-service">
                <section className="picker-area">
                    <p className="title text-subtitle text-center text-white">
                        Personalize o App dos clientes
                    </p>
                    <p className="step-indicator text-title text-white text-center">
                        3/3
                    </p>
                    <PickRatingIcon />
                </section>
                <AppPreview />
            </div>
        </Fragment>
    );
}
