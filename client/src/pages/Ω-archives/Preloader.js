import React from 'react';
import { pulse } from '../keyframes/pulse';
import styled, { keyframes } from 'styled-components';

export default function Preloader() {
    // const loadImage = () => {
    //     var img = new Image(),
    //         x = document.querySelector("babadoo-logo");

    //     img.onload = function() {
    //         x.src = img.src;
    //     };

    //     img.src = "img/babadoo-logo_no-slogon.png";
    // }
    return (
        <DivWrapper>
            <img
                id="babadoo-logo"
                src="img/babadoo-logo_no-slogon.png"
                alt="babadoo - sexyshop está carregando..."
                height="150px"
            />
            <section>
                <h1 className="text-slogon text-center">
                    <strong>
                        <span>L</span>ingeries <br />e<br /> Acessórios Eróticos
                    </strong>
                </h1>
            </section>
            <section className="loading-container">
                <h2 className="">Carregando</h2>
                <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div>
            </section>
        </DivWrapper>
    );
}

const bounceDots = keyframes`
    0%, 80%, 100% {
      transform: scale(0);
    } 40% {
      transform: scale(1.0);
    }
`;

const DivWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    background: var(--mainWhite);
    color: var(--mainDark);
    z-index: 999;

    & img {
        transition: 0.5s;
        animation: ${pulse} 1s linear infinite;
    }

    //Three-dot bouncing loading effect
    //Resource: https://codepen.io/danielmorosan/pen/XmYBVx
    .loading-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        margin-top: 40px;
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
        background-color: #333;

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
