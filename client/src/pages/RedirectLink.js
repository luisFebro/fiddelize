import React, { useEffect } from 'react';
import { getUrlLink } from '../redux/actions/userActions';

export default function RedirectLink() {
    useEffect(() => {
        const code = 'luis_yvczdd8';
        getUrlLink(code);
    }, [])

    return (
        <div
            style={{backgroundColor: 'var(--mainWhite)', minHeight: '300px'}}
            className="mt-3 text-title"
        >
            Redirecionando...
        </div>
    );
}