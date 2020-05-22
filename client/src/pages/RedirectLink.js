import React, { useEffect, useState } from 'react';
import { getUrlLink } from '../redux/actions/userActions';

export default function RedirectLink({ match }) {
    const [error, setError] = useState("");
    const code = match.params.nameAndCode;

    useEffect(() => {
        getUrlLink(code)
        .then(res => {
            if(res.status === 500) return setError("Problema de Conexão. Tente novamente...")
            if(res.status !== 200) return setError("Link Inválido!");
            window.location.href = res.data;
        })
    }, [code])

    return (
        <div
            style={{backgroundColor: 'var(--mainWhite)', minHeight: '350px'}}
            className="mt-2"
        >
            <div className="text-title text-purple m-3">
                {error
                ? <p className="text-red">{error}</p>
                : "Redirecionando..."}
            </div>
        </div>
    );
}