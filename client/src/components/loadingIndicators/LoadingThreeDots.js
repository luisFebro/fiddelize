import React from 'react';
import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';

LoadingThreeDots.propTypes = {
    color: PropTypes.string,
}

export default function LoadingThreeDots({ color }) {
    const styles={
        text: {
            color: color || "var(--mainDark)",
        },
        spinner:{
            backgroundColor: color || '#333'
        }
    }

    return (
        <div className="col-10 mx-auto">
            <DivWrapper>
                <section className="loading-container" style={styles.text}>
                    <h2 className="main-font">Carregando</h2>
                    <div className="spinner">
                        <div style={styles.spinner} className="bounce1"></div>
                        <div style={styles.spinner} className="bounce2"></div>
                        <div style={styles.spinner} className="bounce3"></div>
                    </div>
                </section>
            </DivWrapper>
        </div>
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
