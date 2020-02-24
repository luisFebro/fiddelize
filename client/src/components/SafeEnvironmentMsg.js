import React from 'react';

export default function SafeEnviromentMsg() {
    return (
        <div className="text-center text-p my-2 font-weight-bold text-small">
            <span>
                <i className="fas fa-lock"></i>
            </span>   Ambiente seguro!<br />
            Envio de dados encriptografados
            <br />e mantidos de forma privada.
        </div>
    );
}