import React from 'react';
import styled, { keyframes } from 'styled-components';
import { CLIENT_URL } from '../../config/clientUrl';

export default function MobileScreenLoading({ color, backgroundColor }) {
    return (
        <section className="position-relative">
            <div
                className="container-center-col"
                style={{
                    color: color || 'var(--mainWhite)',
                    padding: '105px 0',
                    backgroundColor: backgroundColor || 'var(--lightPurple)',
                }}
            >
                <img
                    className="svg-elevation pulse-it"
                    id="logo"
                    src={`${CLIENT_URL}/img/official-logo-white.png`}
                    alt="logo carregando..."
                    height="150px"
                />
                <DivLoadingTxt className="loading-container text-shadow">
                    <h2 className="loading-text">Carregando</h2>
                    <div className="spinner text-shadow">
                        <div className="bounce1"></div>
                        <div className="bounce2"></div>
                        <div className="bounce3"></div>
                    </div>
                </DivLoadingTxt>
            </div>
        </section>
    );
}

const bounceDots = keyframes`
    0%, 80%, 100% {
      transform: scale(0);
    } 40% {
      transform: scale(1.0);
    }
`;

const DivLoadingTxt = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 40px;

    .loading-text {
        color: ${({ color }) => color || "var(--mainWhite)"};
        fontWeight: bold;
    }

    & .spinner {
        //margin: 100px auto 0;
        width: 70px;
        text-align: center;
    }

    & .spinner > div {
        margin: 5px;
        width: 6px;
        height: 6px;
        background-color: var(--mainWhite);

        border-radius: 100%;
        display: inline-block;
        animation: ${bounceDots} 1.4s infinite ease-in-out both;
    }

    & .spinner .bounce1 {
        animation-delay: -0.32s;
    }

    & .spinner .bounce2 {
        animation-delay: -0.16s;
    }
`;


/* ARCHIVES
// const loadImage = () => {
//     var img = new Image(),
//         x = document.querySelector("babadoo-logo");

//     img.onload = function() {
//         x.src = img.src;
//     };

//     img.src = "img/babadoo-logo_no-slogon.png";
// }
<section>
    <h1 className="text-title text-center">
        <strong>
            <span>L</span>ingeries <br />e<br /> Acessórios Eróticos
        </strong>
    </h1>
</section>
*/