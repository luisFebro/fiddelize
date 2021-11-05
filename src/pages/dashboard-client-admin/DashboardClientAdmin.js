import { withRouter } from "react-router-dom";
import getFirstName from "utils/string/getFirstName";
import { Fragment } from "react";
import useData from "init";
import getDayGreetingBr from "utils/getDayGreetingBr";
import useBackColor from "hooks/useBackColor";
import useScrollUp from "hooks/scroll/useScrollUp";
import NotifPermissionBanner from "components/pwa-push-notification/NotifPermissionBanner";
import GroupedDashSessions from "./GroupedDashSessions";
import "./mainLayout.scss";
import MoreOptionsMenu from "./MoreOptionsMenu";
import PlanBadges from "./PlanBadges";

function DashboardClientAdmin({ location, history }) {
    const { name } = useData();
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
            <NotifPermissionBanner
                title="Receba notificações sobre seus clientes!"
                subtitle="saiba dos relatos de compra e quando uma meta é alcançada em tempo real"
            />
        </Fragment>
    );
}

export default withRouter(DashboardClientAdmin);

/* ARCHIVES
{isThisApp()
? (
    <Navbar />
) : null}
*/
