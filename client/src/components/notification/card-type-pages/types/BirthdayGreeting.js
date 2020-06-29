import React from 'react';

export default function BirthdayGreeting() {
    const showTitle = () => (
        <div className="mt-4">
            <p
                className="text-subtitle text-purple text-center font-weight-bold"
            >
                Feliz Aniversário!
            </p>
        </div>
    );

    return (
        <section>
            {showTitle()}
        </section>
    );
}