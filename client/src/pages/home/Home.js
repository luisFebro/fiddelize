import React, { Fragment } from 'react';
import VAsyncRegisterClientAdmin from '../../components/auth/VAsyncRegisterClientAdmin';
import ScrollArrow from '../../keyframes/built/scroll-arrow/ScrollArrow';
import { Link } from 'react-router-dom';
import VAsyncAppShowCase from './VAsyncAppShowCase';


export default function Home() {
    const isSmall = React.useCallback(window.Helper.isSmallScreen(), []);

    const showSlogon = () => (
        <section className="mt-5 d-flex flex-column flex-md-row justify-content-center align-items-center">
            <div className="align-self-center m-3">
                <img
                    className="svg-elevation"
                    src="/img/official-logo-white.png"
                    alt="logo"
                    width={150}
                    height='auto'
                />
            </div>
            <h1
                className="text-center align-item-center text-md-left text-title text-white"
                style={{ maxWidth: '700px'}}
            >
                Pontos de Fidelidade Digital para seus Clientes
            </h1>
        </section>
    );

    return(
        <Fragment>
            <span className="text-right text-white for-version-test">
                {"T73"}
            </span>
            {showSlogon()}
            <div style={{margin: isSmall ? '10px 0 300px 0' : '50px 0 300px 0'}} className="d-flex justify-content-center">
                <ScrollArrow color="white" />
            </div>
            {<VAsyncAppShowCase />}
            <VAsyncRegisterClientAdmin />
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
