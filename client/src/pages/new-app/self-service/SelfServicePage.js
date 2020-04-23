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
                    <p className="text-subtitle text-center text-white">
                        Personalize o app do<br />seu cliente aqui
                    </p>
                    <PickRatingIcon />
                </section>
                <AppPreview />
            </div>
        </Fragment>
    );
}