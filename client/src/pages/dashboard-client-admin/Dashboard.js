import React, { Fragment } from 'react';
import Title from '../../components/Title';
import { useStoreState } from 'easy-peasy';
import GroupedDashSessions from './GroupedDashSessions';
import getDayGreetingBr from '../../utils/getDayGreetingBr';
import Navbar from '../../components/_layout/navbar';
import isThisApp from '../../utils/window/isThisApp';

export default function Dashboard() {
    const name = useStoreState(state => state.userReducer.cases.currentUser.name);

    return (
        <Fragment>
            {isThisApp()
            ? (
                <Navbar />
            ) : null}
            <p
                style={{color: "white", margin: 0, paddingLeft: 20}}
                className="text-normal"
            >
                {`${getDayGreetingBr()}${name ? `, ${name.cap()}!` : " ..."}`}
            </p>
            <br/>
            <GroupedDashSessions />
        </Fragment>
    );
}
