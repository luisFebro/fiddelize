import React from 'react';

export default function SafeEnviromentMsg() {
    return (
        <div className="text-center text-p mb-2 mt-4 font-weight-bold text-small">
            <span>
                <i className="fas fa-lock"></i>
            </span>   Ambiente seguro!<br />
            <span className="text-left text-nowrap">
                Envio de dados encriptografados
            </span>
            <br />
            e mantidos de forma privada.
        </div>
    );
}