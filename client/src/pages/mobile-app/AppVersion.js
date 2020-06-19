import React from 'react';

export default function AppVersion() {
    return (
        <section
            style={{
                backgroundColor: 'black',
                borderRadius: '30px',
                color: 'white',
                padding: '4px 5px',
                fontSize: '18px',
                border: '3px solid white',
                marginBottom: '10px',
                marginLeft: '10px',
                width: '130px',
            }}
            className="app-version text-small text-center"
        >
            Versão 3.506.0
        </section>
    );
}