import React from 'react';
import ButtonMulti from '../components/buttons/material-ui/ButtonMulti'
import isThisApp from '../utils/window/isThisApp';

const isApp = isThisApp();
const handleHomeRedirect = () => window.location.href = isApp ?  "/mobile-app" : "/"

export default function UnavailableService() {
    return (
        <div className="container-center flex-column">
            <img
                src={`/img/illustrations/server-down.svg`}
                alt="serviço indisponível"
                className="image-center tranparent-img-shadow"
            />
            <p className="text-white text-title text-center mt-5 mx-2 text-em-1-5 margin-auto-90">
                A Fiddelize está em uma breve manutenção,
                <br />
                e logo estará de volta!
            </p>
            <div className="container-center my-3">
                <ButtonMulti
                    title="Tentar acesso novamente"
                    onClick={handleHomeRedirect}
                    backgroundColor={"var(--themeSDark)"}
                />
            </div>
        </div>
    );
}