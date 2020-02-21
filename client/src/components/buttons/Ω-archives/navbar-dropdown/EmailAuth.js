import React from 'react';

export default function EmailAuth() {
    return (
        <button
            className="btn login-btn"
            style={{ backgroundColor: 'grey', border: 'none', margin: 5, display: 'block' }}
        >
            <img src="img/icons/buttonslogin/email.png" alt="ícone de login de email" className="btn-icon" />
            <span className="btn-txt">
                Entrar com <strong>Nome/Email</strong>
            </span>
        </button>
    );
}
