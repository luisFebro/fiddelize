import React, { Fragment } from 'react';
import Register from '../components/auth/Register';
import { Link } from 'react-router-dom';
// import ModalForPermission from '../components/pwa-push-notification/ModalForPermission';
// import showVanillaToast from '../components/vanilla-js/toastify/showVanillaToast'

export default function Home() {
    // const showToast = () => {
    //     showVanillaToast("Testing", 10000, {avatar: ' '});
    // }
    const showMainContent = () => (
        <div className="ml-md-4">
            <span className="text-right for-version-test">{""}</span>
            <div className="center-small">
                <Register />
            </div>
        </div>
    );

    return(
        <Fragment>
            <h1 className="text-center text-title mt-4 text-white">Pontos de Fidelidade Online para seus Clientes</h1>
            <div style={{color: 'white'}} className="d-flex flex-column-reverse flex-md-row justify-content-center">
                {showMainContent()}
                <div className="container-center align-items-start mt-5">
                    <img
                        className="svg-elevation"
                        src="/img/official-logo-white.svg"
                        alt="logo"
                        width={300}
                        height={300}
                    />
                </div>
            </div>
        </Fragment>
    );
};


/* ARCHIVES
<div className="mt-3 text-subtitle text-center">Acumule pontos e ganhe produtos e serviços</div>
<Link to="/regulamento">
    <div
        className="my-5 text-subtitle font-weight-italic text-center"
        style={{color: "var(--mainPink)", cursor: "pointer"}}
    >
        Consulte<br />as Regras Aqui
    </div>
</Link>
*/