import { Fragment } from "react";
import getDayGreetingBr from "../../../utils/getDayGreetingBr";
import GroupedDashSessions from "./GroupedDashSessions";
import ShareLink from "./share-link/ShareLink";
import BizTeamNavbar from "./navbar/BizTeamNavbar";
import useScrollUp from "../../../hooks/scroll/useScrollUp";
import useBackColor from "../../../hooks/useBackColor";
import useAuth from "../../../hooks/useAuthUser";
import useData from "../../../hooks/useData";

export default function BizTeamApp({ history }) {
    const [userFirstName] = useData(["firstName"]);

    useAuth({ history, roles: "nucleo-equipe, cliente-admin, cliente-membro" });

    useScrollUp();
    useBackColor("var(--themeBackground--default)");

    const showGreeting = () => (
        <p
            className="position-relative text-normal text-center text-white"
            style={{ margin: "20px 0px 0px" }}
        >
            <span className="font-weight-bold">
                {getDayGreetingBr()}, {userFirstName}!
            </span>
        </p>
    );

    return (
        <Fragment>
            <BizTeamNavbar />
            <section className="animated fadeInUp">
                {showGreeting()}
                <ShareLink />
            </section>
            <br />
            <GroupedDashSessions />
        </Fragment>
    );
}
