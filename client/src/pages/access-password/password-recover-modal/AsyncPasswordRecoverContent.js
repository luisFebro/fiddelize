import React from "react";

export default function AsyncPasswordRecoverContent() {
    const showTitle = () => (
        <p
            className="text-nowrap position-relative text-subtitle text-purple text-center font-weight-bold"
            style={{ margin: "0 15px", top: "15px" }}
        >
            Redefinir Senha
        </p>
    );

    return (
        <section>
            {showTitle()}
            <p className="my-5 text-purple text-normal font-weight-bold mx-3">
                Precisamos confirmar algumas informações. Beleza?
            </p>
        </section>
    );
}
