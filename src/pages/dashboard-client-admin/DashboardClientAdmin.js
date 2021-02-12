import React, { Fragment } from "react";
import Title from "../../components/Title";
import GroupedDashSessions from "./GroupedDashSessions";
import getDayGreetingBr from "../../utils/getDayGreetingBr";
import Navbar from "../../components/_layout/navbar";
import isThisApp from "../../utils/window/isThisApp";
import "./mainLayout.scss";
import getFirstName from "../../utils/string/getFirstName";
import { useProfile } from "../../hooks/useRoleData";
import MoreOptionsMenu from "./MoreOptionsMenu";
import PlanBadges from "./PlanBadges";
import { withRouter } from "react-router-dom";
import useBackColor from "../../hooks/useBackColor";
import useScrollUp from "../../hooks/scroll/useScrollUp";

function DashboardClientAdmin({ location, history }) {
    const { name } = useProfile();
    useBackColor("var(--themeBackground--default)");
    useScrollUp();

    const showGreeting = () => (
        <p
            className="position-relative text-normal text-center text-white"
            style={{ margin: 25, top: 20 }}
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
            <MoreOptionsMenu location={location} history={history} />
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
