import React from 'react';

export default function SafeEnviromentMsg() {
    return (
        <div className="text-center text-p mb-2 mt-4 main-font">
            <span style={{fontWeight: 'bolder'}}>
                <i className="fas fa-lock"></i>{" "}
                <span style={{fontSize: '14px'}}>Ambiente seguro!</span><br />
                <p style={{textHeight: '2px', fontSize: '14px'}} className="text-nowrap">
                    Envio de dados encriptografados<br/>
                    e mantidos de forma privada.
                </p>
            </span>
        </div>
    );
}