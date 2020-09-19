import React, { Fragment } from "react";
import Title from "../../components/Title";
import GroupedDashSessions from "./GroupedDashSessions";
import getDayGreetingBr from "../../utils/getDayGreetingBr";
import Navbar from "../../components/_layout/navbar";
import isThisApp from "../../utils/window/isThisApp";
import "./mainLayout.scss";
import getFirstName from "../../utils/string/getFirstName";
import { useProfile } from "../../hooks/useRoleData";
import ActionBtns, { PlanBadges } from "./ActionBtns";
import { withRouter } from "react-router-dom";
import useBackColor from "../../hooks/useBackColor";
import useScrollUp from "../../hooks/scroll/useScrollUp";

function DashboardClientAdmin({ location }) {
    const { name } = useProfile();
    useBackColor("var(--themeBackground--default)");
    useScrollUp();

    const showGreeting = () => (
        <p
            className="position-relative text-normal text-center text-white"
            style={{ margin: 15, top: 15 }}
        >
            <span className="font-weight-bold">
                {getDayGreetingBr()}, {name ? `${getFirstName(name)}!` : " ..."}
            </span>
        </p>
    );

    return (
        <Fragment>
            {showGreeting()}
            <PlanBadges />
            <br />
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
