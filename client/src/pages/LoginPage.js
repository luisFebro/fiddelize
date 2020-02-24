import React, { useState, Fragment } from 'react';
import Login from '../components/auth/Login';
import LoyaltyScoreHandler from './client/loyalty-client-scores';
import { useStoreState } from 'easy-peasy';
// import { CLIENT_URL } from '../config/clientUrl';

export default function LoginPage() {
    const { currentComp } = useStoreState(state => ({
        currentComp: state.componentReducer.cases.currentComp,
    }))

    return (
        <div className="container-center mt-5">
            <div>
                {currentComp === "login"
                ? (
                    <Login />
                ) : (
                    <LoyaltyScoreHandler />
                )}
            </div>

        </div>
    );
}