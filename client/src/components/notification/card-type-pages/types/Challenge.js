import React from 'react';

export default function Challenge({ subtype }) {
    const showTitle = () => (
        <div className="mt-4">
            <p
                className="text-subtitle text-purple text-center font-weight-bold"
            >
                Cliente concluíu desafio
            </p>
        </div>
    );

    return (
        <section>
            {showTitle()}
        </section>
    );
}