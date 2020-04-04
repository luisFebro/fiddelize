import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function SafeEnviromentMsg() {
    return (
        <div className="text-center text-p mb-2 mt-4 main-font">
            <span style={{fontWeight: 'bolder', fontSize: '14px'}}>
                <FontAwesomeIcon icon="lock" />{" "}
                <span>Ambiente seguro!</span><br />
                <p style={{textHeight: '2px'}} className="text-nowrap">
                    Envio de dados encriptografados<br/>
                    e mantidos de forma privada.
                </p>
            </span>
        </div>
    );
}