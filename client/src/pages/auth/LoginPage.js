import React, { useState, Fragment } from 'react';
import AsyncLogin from '../../components/auth/AsyncLogin';
import AsyncLoyaltyScoreHandler from '../client/loyalty-client-scores';
import { useStoreState } from 'easy-peasy';
import CompLoader from '../../components/CompLoader';

export default function LoginPage() {
    const { currentComp } = useStoreState(state => ({
        currentComp: state.componentReducer.cases.currentComp,
    }))

    return (
        <>
            <div className="container-center mt-5">
                <div>
                    {currentComp === "login"
                    ? (
                        <div style={{margin: '70px 0'}}>
                            <CompLoader
                                comp={<AsyncLogin />}
                                hide={true}
                                timeout={2000}
                                width={330}
                                marginY={100}
                            />
                        </div>
                    ) : (
                        <div style={{margin: '70px 0'}}>
                            <AsyncLoyaltyScoreHandler />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}