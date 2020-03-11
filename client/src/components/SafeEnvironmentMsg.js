import React from 'react';

export default function SafeEnviromentMsg() {
    return (
        <div className="text-center font-weight-bold text-p mb-2 mt-4 main-font">
            <span style={{fontWeight: 'bolder', fontSize: '16px'}}>
                <i className="fas fa-lock"></i>{" "}
                Ambiente seguro!<br />
                <p style={{textHeight: '2px'}} className="text-nowrap">
                    Envio de dados encriptografados<br/>
                    e mantidos de forma privada.
                </p>
            </span>
        </div>
    );
}