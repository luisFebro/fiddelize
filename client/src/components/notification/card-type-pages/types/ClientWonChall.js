import React from 'react';

export default function ClientWonChall() {
    const showTitle = () => (
        <div className="mt-4">
            <p
                className="text-subtitle text-purple text-center font-weight-bold"
            >
                &#187; Cliente concluíu desafio
            </p>
        </div>
    );

    return (
        <section>
            {showTitle()}
        </section>
    );
}