import React from 'react';
import AppPreview from './AppPreview';
import AppPickersHandler from './pickers/AppPickersHandler';
import './style.scss';

export default function SelfServicePage() {
    const showTitle = () => (
        <div className="text-center text-white my-4">
            <p className="text-title">Self-Service</p>
        </div>
    );

    return (
        <div style={{overflow: 'hidden'}}>
            {showTitle()}
            <div className="main-self-service">
                <section className="picker-area">
                    <p className="title text-subtitle text-center text-white">
                        Personalize o App dos clientes
                    </p>
                    <AppPickersHandler />
                </section>
                <AppPreview />
            </div>
        </div>
    );
}

/*
 */
