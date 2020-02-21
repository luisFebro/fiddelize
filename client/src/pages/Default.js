import React from 'react';
// import RedirectPage from '../components/RedirectPage';
import Illustration from '../components/Illustration';
import { CLIENT_URL } from '../config/clientUrl';
import InitialPageButton from '../components/buttons/InitialPageButton';

export default function Default({ location }) {
    const { pathname } = location;

    return(
        <div className="container-center flex-column">
            <img
                src={`${CLIENT_URL}/img/illustrations/page-not-found.svg`}
                alt="página não encontrada..."
                className="image-center tranparent-img-shadow"
            />
            <p className="text-white text-normal text-center mt-5 mx-2 text-em-1-5">
                Oops! A página:<br />
                <span
                    className="text-em-2 font-weight-bold text-break"
                >
                    {CLIENT_URL}{pathname}
                </span>
                <br />
                não foi encontrada!
                <InitialPageButton />
            </p>
        </div>
    );
}

/*
<Illustration
    title='Oops! Essa página não foi encontrada.'
    img={`${CLIENT_URL}/img/illustrations/page-not-found.svg`}
    alt="Página não encontrada."
/>
 */
