import React from 'react';



const latestVersion = "3.6.1"
const updateDescription = "Login/Acesso - Novo status para verificar novidades em funcionalidades"




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
                width: '140px',
            }}
            className="app-version text-small text-center"
        >
            Versão {latestVersion}
        </section>
    );
}