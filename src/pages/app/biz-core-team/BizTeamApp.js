import { Fragment, useState } from "react";
import getDayGreetingBr from "utils/getDayGreetingBr";
import useScrollUp from "hooks/scroll/useScrollUp";
import useBackColor from "hooks/useBackColor";
import useData from "init";
import ButtonFab from "components/buttons/material-ui/ButtonFab";
import NotifPermissionBanner from "components/pwa-push-notification/NotifPermissionBanner";
import { Load } from "components/code-splitting/LoadableComp";
import ModalFullContent from "components/modals/ModalFullContent";

// import { IS_DEV } from "config/clientUrl";
import GroupedDashSessions from "./GroupedDashSessions";
import ShareLink from "./share-link/ShareLink";
import BizTeamNavbar from "./navbar/BizTeamNavbar";

const AsyncCustomDataForm = Load({
    loading: false,
    loader: () =>
        import(
            "pages/mobile-app/custom-data-form/CustomDataForm" /* webpackChunkName: "custom-form-comp-lazy" */
        ),
});

export default function BizTeamApp({ history }) {
    const [userFirstName, agentJob, loading] = useData([
        "firstName",
        "agentJob",
    ]);
    const { userId } = useData();

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

    const [openCustomData, setOpenCustomData] = useState(true);

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
            {!loading &&
                Boolean(!userFirstName || userFirstName === "Usuário") && (
                    <ModalFullContent
                        contentComp={
                            <AsyncCustomDataForm
                                userId={userId}
                                role="nucleo-equipe"
                            />
                        }
                        fullScreen={false}
                        fullOpen={openCustomData}
                        setFullOpen={setOpenCustomData}
                        needCloseBtn={false}
                        needIndex={false}
                    />
                )}
        </Fragment>
    );
}

function CabinButton({ agentJob, history }) {
    const needBtn = agentJob === "dev"; // agentJob === "rep-comercial"

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
