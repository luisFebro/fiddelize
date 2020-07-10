import React from 'react';

export default function Content() {
    const showTitle = () => (
        <div className="mt-4">
            <p
                className="text-subtitle text-purple text-center font-weight-bold"
            >
                &#187; Tarefas Feitas
            </p>
        </div>
    );

    return (
        <section>
            {showTitle()}
        </section>
    );
}