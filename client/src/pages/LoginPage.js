import React, { useState, Fragment } from 'react';
import Login from '../components/auth/Login';
import LoyaltyScoreHandler from './client/loyalty-client-scores';
import { useStoreState } from 'easy-peasy';
import { CLIENT_URL } from '../config/clientUrl';

export default function LoginPage() {
    const { currentComp } = useStoreState(state => ({
        currentComp: state.componentReducer.cases.currentComp,
    }))

    const showMainContent = () => (
        <div className="mr-md-5 ml-md-4">
            {currentComp === "login" ? (
                <Fragment>
                    <div
                        className="my-4 ml-3 text-subtitle text-center"
                    >
                        Identifique-se para atualizar
                        <br />
                        seus pontos de fidelidade
                        <br />
                        ou
                        <br />
                        ter acesso ao gerenciamento
                    </div>
                    <div className="mr-md-5 ml-md-5 center-small">
                        <Login />
                    </div>
                </Fragment>
            ) : (
                <LoyaltyScoreHandler />
            )}
        </div>
    );

    return (
        <div style={{color: 'white'}} className="d-flex flex-column-reverse flex-md-row justify-content-center">
            {showMainContent()}
            <img
                className="img-fluid"
                src={`${CLIENT_URL}/img/official-logo-white.svg`}
                alt="logo"
                width={300}
                height="auto"
            />
        </div>
    );
}