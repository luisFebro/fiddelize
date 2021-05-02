import { Fragment } from "react";
import getDayGreetingBr from "../../../utils/getDayGreetingBr";
import GroupedDashSessions from "./GroupedDashSessions";
import ShareLink from "./share-link/ShareLink";
import BizTeamNavbar from "./navbar/BizTeamNavbar";
import useScrollUp from "../../../hooks/scroll/useScrollUp";
import useBackColor from "../../../hooks/useBackColor";
import useAuth from "../../../hooks/useAuth";
import useData from "init";
import ButtonFab from "../../../components/buttons/material-ui/ButtonFab";
import NotifPermissionBanner from "../../../components/pwa-push-notification/NotifPermissionBanner";

export default function BizTeamApp({ history }) {
    const [userFirstName, agentJob] = useData(["firstName", "agentJob"]);

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
            <CabinButton agentJob={agentJob} history={history} />
            <NotifPermissionBanner
                title="Receba notificações sobre vendas!"
                subtitle="saiba quando suas vendas são realizadas em tempo real"
            />
        </Fragment>
    );
}

function CabinButton({ agentJob, history }) {
    const needBtn = agentJob === "rep-comercial" || agentJob === "dev";

    return (
        <section
            className={`${
                needBtn ? "d-block" : "d-none"
            } animated fadeInUp delay-1s`}
            style={{
                position: "fixed",
                bottom: 15,
                right: 15,
                zIndex: 1000,
            }}
        >
            <ButtonFab
                title="Cabine Fiddelize"
                backgroundColor="var(--themeP)"
                color="var(--vocarizaCyan)"
                onClick={() => {
                    history.push("/t/app/nucleo-equipe/cabine-fiddelize");
                }}
                style={{
                    zIndex: 2000,
                }}
                position="relative"
                variant="extended"
                size="large"
            />
        </section>
    );
}
