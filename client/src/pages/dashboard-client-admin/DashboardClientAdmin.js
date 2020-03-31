import React, { Fragment } from 'react';
import Title from '../../components/Title';
import { useStoreState } from 'easy-peasy';
import GroupedDashSessions from './GroupedDashSessions';
import getDayGreetingBr from '../../utils/getDayGreetingBr';
import Navbar from '../../components/_layout/navbar';
import isThisApp from '../../utils/window/isThisApp';
import './mainLayout.scss';
import getFirstName from '../../utils/string/getFirstName';

export default function DashboardClientAdmin() {
    const { name } = useStoreState(state => ({
        name: state.userReducer.cases.currentUser.name,
    }));

    const showGreeting = () => (
        <p
            className="position-relative text-normal text-center text-white"
            style={{margin: 0, top: '10px', minHeight: '55px'}}
        >
            <span>{getDayGreetingBr()}, {name ? `${getFirstName(name.cap())}!` : " ..."}</span>
        </p>
    );

    return (
        <Fragment>
            {showGreeting()}
            <br/>
            <GroupedDashSessions />
        </Fragment>
    );
}

/*ARCHIVES
{isThisApp()
? (
    <Navbar />
) : null}
*/
