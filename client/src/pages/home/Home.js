import React, { Fragment, useState } from 'react';
import VAsyncRegisterClientAdmin from '../../components/auth/VAsyncRegisterClientAdmin';
import ScrollArrow from '../../keyframes/built/scroll-arrow/ScrollArrow';
import { Link } from 'react-router-dom';
import AppShowCase from './AppShowCase';
import { CLIENT_URL } from '../../config/clientUrl';
import CompLoader from '../../components/CompLoader';

export default function Home() {
    const [viewPhone, setViewPhone] = useState(false);

    const isSmall = React.useCallback(window.Helper.isSmallScreen(), []);

    const showSlogon = () => (
        <section className="mt-3 d-flex flex-column flex-md-row justify-content-center align-items-center">
            <div className="align-self-center m-1">
                <picture>
                    <source srcSet="/img/official-logo-white.webp" type="image/webp" />
                    <source srcSet="/img/official-logo-white.png" type="image/png" />
                    <img
                        className="svg-elevation"
                        src={`${CLIENT_URL}/img/official-logo-white.webp`}
                        alt="logo"
                        width={150}
                        height='auto'
                    />
                </picture>
            </div>
            <h1
                className="mx-2 mx-md-5 text-center align-item-center text-md-left text-title text-white"
                style={{ maxWidth: '700px'}}
            >
                Pontos de Fidelidade Digital para seus Clientes
            </h1>
        </section>
    );

    return(
        <Fragment>
            <section className="full-height">
                <span className="text-right text-white for-version-test">
                    {"T99"}
                </span>
                {showSlogon()}
                <div style={{margin: isSmall ? '10px 0 100px 0' : '50px 0 100px 0'}} className="d-flex justify-content-center">
                    <ScrollArrow color="white" />
                </div>
            </section>
            <AppShowCase setData={setViewPhone} />
            <CompLoader
                comp={<VAsyncRegisterClientAdmin />}
                hide={viewPhone}
                timeout={3500}
                width={200}
                marginY={30}
            />
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
