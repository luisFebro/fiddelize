import React from 'react';

export default function FiddelizeSystem() {
    const showTitle = () => (
        <div className="mt-4">
            <p
                className="text-subtitle text-purple text-center font-weight-bold"
            >
                &#187; Fiddelize informe
            </p>
        </div>
    );

    return (
        <section>
            {showTitle()}
        </section>
    );
}