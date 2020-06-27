import React from 'react';

export default function BirthdaysInWeek() {
    const showTitle = () => (
        <div className="mt-4">
            <p
                className="text-subtitle text-purple text-center font-weight-bold"
            >
                &#187; Aniversários da Semana
            </p>
        </div>
    );

    return (
        <section>
            {showTitle()}
        </section>
    );
}