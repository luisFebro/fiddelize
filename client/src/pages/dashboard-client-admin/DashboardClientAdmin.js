import React, { Fragment } from 'react';
import Title from '../../components/Title';
import GroupedDashSessions from './GroupedDashSessions';
import getDayGreetingBr from '../../utils/getDayGreetingBr';
import Navbar from '../../components/_layout/navbar';
import isThisApp from '../../utils/window/isThisApp';
import './mainLayout.scss';
import getFirstName from '../../utils/string/getFirstName';
import { useProfile } from '../../hooks/useRoleData';
import ActionBtns from './ActionBtns';
import { withRouter } from 'react-router-dom';

function DashboardClientAdmin({ location }) {
    const { userName } = useProfile();

    const showGreeting = () => (
        <p
            className="position-relative text-normal text-center text-white"
            style={{margin: 0, top: '10px', minHeight: '65px'}}
        >
            <span>{getDayGreetingBr()}, {userName ? `${getFirstName(userName)}!` : " ..."}</span>
        </p>
    );

    return (
        <Fragment>
            {showGreeting()}
            <br/>
            <GroupedDashSessions />
            <ActionBtns location={location} />
        </Fragment>
    );
}

export default withRouter(DashboardClientAdmin);

/*ARCHIVES
{isThisApp()
? (
    <Navbar />
) : null}
*/
