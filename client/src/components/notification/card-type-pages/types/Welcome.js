import React from 'react';

export default function Welcome() {
    const showTitle = () => (
        <div className="mt-4">
            <p
                className="text-subtitle text-purple text-center font-weight-bold"
            >
                &#187; Seja bem-vindo!
            </p>
        </div>
    );

    return (
        <section>
            {showTitle()}
        </section>
    );
}